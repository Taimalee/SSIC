# Smart Soil Irrigation Controller

A smart irrigation system that uses fuzzy logic to determine optimal watering times based on environmental conditions. The system takes into account soil moisture, temperature, and sunlight intensity to make intelligent watering decisions.



## Home Page 

![SSIC](https://github.com/Taimalee/SSIC/blob/master/SSic.png)

## Overview

This project implements an intelligent irrigation controller using fuzzy logic principles. It provides both a backend system for calculations and a modern web interface for user interaction.

### Key Features

- Fuzzy logic-based decision making
- Real-time watering time calculations
- Modern web interface
- RESTful API
- Environmental factor consideration:
  - Soil moisture levels
  - Temperature
  - Sunlight intensity

## Technical Details

### Fuzzy Logic System

The system uses triangular membership functions to classify input conditions:

#### Soil Moisture (0-100%)
- Low: [0, 0, 40] - Peaks at 0%, extends to 40%
- Medium: [20, 50, 80] - Centered around 50%
- High: [60, 100, 100] - Peaks and plateaus at 100%

#### Temperature (0-40°C)
- Low: [0, 0, 20] - Peaks at 0°C, extends to 20°C
- Moderate: [15, 25, 35] - Centered around 25°C
- High: [30, 40, 40] - Peaks at 40°C

#### Sunlight Intensity (0-100%)
- Low: [0, 0, 40] - Peaks at 0%, extends to 40%
- Medium: [20, 50, 80] - Centered around 50%
- High: [60, 100, 100] - Peaks and plateaus at 100%

#### Watering Time Output (0-30 minutes)
- Short: [0, 0, 15] - Minimal watering time
- Moderate: [10, 15, 20] - Average watering duration
- Long: [15, 30, 30] - Extended watering period

### Decision Rules

The system uses five main rules to determine watering time:

1. IF soil_moisture is LOW AND temperature is HIGH AND sunlight is HIGH
   THEN watering_time is LONG

2. IF soil_moisture is LOW AND (temperature is MODERATE OR sunlight is MEDIUM)
   THEN watering_time is MODERATE

3. IF soil_moisture is MEDIUM
   THEN watering_time is MODERATE

4. IF soil_moisture is HIGH
   THEN watering_time is SHORT

5. IF temperature is LOW
   THEN watering_time is SHORT

## Technology Stack

- **Backend**:
  - Python 3.x
  - Flask (Web framework)
  - NumPy (Numerical computations)
  - scikit-fuzzy (Fuzzy logic implementation)
  - Flask-CORS (Cross-origin resource sharing)

- **Frontend**:
  - React
  - Material-UI
  - Axios (HTTP client)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Taimalee/SSIC
cd SSIC
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
npm install
```

## Usage

1. Start the backend server:
```bash
python server.py
```
The server will run on http://localhost:5000

2. Start the frontend development server:
```bash
npm start
```
The frontend will be available at http://localhost:3000

3. Use the web interface to:
   - Adjust soil moisture percentage
   - Set current temperature
   - Input sunlight intensity
   - Calculate recommended watering time

## API Endpoints

### Calculate Watering Time
- **URL**: `/calculate`
- **Method**: POST
- **Content-Type**: application/json
- **Request Body**:
```json
{
    "soil_moisture": 0-100,
    "temperature": 0-40,
    "sunlight": 0-100
}
```
- **Success Response**:
```json
{
    "status": "success",
    "watering_time": float
}
```

## Example Usage

```python
from main import IrrigationController

controller = IrrigationController()
watering_time = controller.calculate_watering_time(
    soil_moisture=25,  # 25% moisture (low)
    temperature=35,    # 35°C (high)
    sunlight=90       # 90% intensity (high)
)
print(f"Recommended watering time: {watering_time} minutes")
```

## How It Works

1. **Input Processing**:
   - The system takes three environmental readings
   - Each input is classified into fuzzy sets using membership functions
   - For example, a temperature of 28°C might be "moderate" with 0.6 membership and "high" with 0.4 membership

2. **Rule Evaluation**:
   - The five fuzzy rules are evaluated using the input memberships
   - Rules use AND (&) and OR (|) operations to combine conditions
   - Each rule contributes to the final output based on its activation level

3. **Output Determination**:
   - The system combines all rule outputs
   - A defuzzification process converts the fuzzy result to a specific watering time
   - The final output is rounded to one decimal place

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
