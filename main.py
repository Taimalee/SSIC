import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

class IrrigationController:
    def __init__(self):
        # Initialize fuzzy variables
        self.soil_moisture = ctrl.Antecedent(np.arange(0, 101, 1), 'soil_moisture')
        self.temperature = ctrl.Antecedent(np.arange(0, 41, 1), 'temperature')
        self.sunlight = ctrl.Antecedent(np.arange(0, 101, 1), 'sunlight')
        self.watering_time = ctrl.Consequent(np.arange(0, 31, 1), 'watering_time')

        # Define membership functions
        self._setup_membership_functions()
        
        # Create control system
        self._setup_control_system()

    def _setup_membership_functions(self):
        # Soil moisture membership functions
        self.soil_moisture['low'] = fuzz.trimf(self.soil_moisture.universe, [0, 0, 40])
        self.soil_moisture['medium'] = fuzz.trimf(self.soil_moisture.universe, [20, 50, 80])
        self.soil_moisture['high'] = fuzz.trimf(self.soil_moisture.universe, [60, 100, 100])

        # Temperature membership functions
        self.temperature['low'] = fuzz.trimf(self.temperature.universe, [0, 0, 20])
        self.temperature['moderate'] = fuzz.trimf(self.temperature.universe, [15, 25, 35])
        self.temperature['high'] = fuzz.trimf(self.temperature.universe, [30, 40, 40])

        # Sunlight membership functions
        self.sunlight['low'] = fuzz.trimf(self.sunlight.universe, [0, 0, 40])
        self.sunlight['medium'] = fuzz.trimf(self.sunlight.universe, [20, 50, 80])
        self.sunlight['high'] = fuzz.trimf(self.sunlight.universe, [60, 100, 100])

        # Watering time membership functions
        self.watering_time['short'] = fuzz.trimf(self.watering_time.universe, [0, 0, 15])
        self.watering_time['moderate'] = fuzz.trimf(self.watering_time.universe, [10, 15, 20])
        self.watering_time['long'] = fuzz.trimf(self.watering_time.universe, [15, 30, 30])

    def _setup_control_system(self):
        # Define rules
        rule1 = ctrl.Rule(self.soil_moisture['low'] & self.temperature['high'] & self.sunlight['high'], 
                         self.watering_time['long'])
        rule2 = ctrl.Rule(self.soil_moisture['low'] & (self.temperature['moderate'] | self.sunlight['medium']), 
                         self.watering_time['moderate'])
        rule3 = ctrl.Rule(self.soil_moisture['medium'], 
                         self.watering_time['moderate'])
        rule4 = ctrl.Rule(self.soil_moisture['high'], 
                         self.watering_time['short'])
        rule5 = ctrl.Rule(self.temperature['low'], 
                         self.watering_time['short'])

        # Create control system
        self.watering_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5])
        self.watering = ctrl.ControlSystemSimulation(self.watering_ctrl)

    def calculate_watering_time(self, soil_moisture, temperature, sunlight):
        """
        Calculate the recommended watering time based on input conditions.
        
        Args:
            soil_moisture (float): Soil moisture percentage (0-100)
            temperature (float): Temperature in Celsius (0-40)
            sunlight (float): Sunlight intensity percentage (0-100)
            
        Returns:
            float: Recommended watering time in minutes
        """
        try:
            self.watering.input['soil_moisture'] = float(soil_moisture)
            self.watering.input['temperature'] = float(temperature)
            self.watering.input['sunlight'] = float(sunlight)
            
            self.watering.compute()
            return round(float(self.watering.output['watering_time']), 1)
        except Exception as e:
            raise ValueError(f"Error calculating watering time: {str(e)}")

# Example usage
if __name__ == "__main__":
    controller = IrrigationController()
    
    # Example inputs
    moisture = 25  # low moisture
    temp = 35     # high temperature
    sun = 90      # high sunlight
    
    watering_time = controller.calculate_watering_time(moisture, temp, sun)
    print(f"Recommended watering time: {watering_time} minutes")
