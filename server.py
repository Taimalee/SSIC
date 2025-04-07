from flask import Flask, request, jsonify
from flask_cors import CORS
from main import IrrigationController

app = Flask(__name__)
CORS(app)

# Create an instance of our irrigation controller
controller = IrrigationController()

@app.route('/')
def home():
    return jsonify({
        'status': 'success',
        'message': 'Smart Irrigation Controller API is running'
    })

@app.route('/calculate', methods=['POST'])
def calculate_watering_time():
    if not request.is_json:
        return jsonify({
            'error': 'Content-Type must be application/json',
            'status': 'error'
        }), 400

    data = request.json
    required_fields = ['soil_moisture', 'temperature', 'sunlight']
    
    # Check if all required fields are present
    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': f'Missing required field: {field}',
                'status': 'error'
            }), 400
    
    try:
        # Validate input ranges
        if not (0 <= float(data['soil_moisture']) <= 100):
            raise ValueError('Soil moisture must be between 0 and 100')
        if not (0 <= float(data['temperature']) <= 40):
            raise ValueError('Temperature must be between 0 and 40')
        if not (0 <= float(data['sunlight']) <= 100):
            raise ValueError('Sunlight must be between 0 and 100')

        # Calculate watering time using our controller
        result = controller.calculate_watering_time(
            data['soil_moisture'],
            data['temperature'],
            data['sunlight']
        )
        
        return jsonify({
            'watering_time': result,
            'status': 'success'
        })
    except ValueError as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'status': 'error'
        }), 500

if __name__ == '__main__':
    print(" * Smart Irrigation Controller API is running")
    print(" * Send POST requests to http://localhost:5000/calculate")
    print(" * Required JSON format: {'soil_moisture': 0-100, 'temperature': 0-40, 'sunlight': 0-100}")
    app.run(debug=True, port=5000) 