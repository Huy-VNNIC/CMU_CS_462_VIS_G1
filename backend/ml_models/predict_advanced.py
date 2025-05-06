#!/usr/bin/env python3
import sys
import json
import pickle
import numpy as np
import os
from datetime import datetime

def load_model(model_path):
    """Load a trained model from a .pkl file"""
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}", file=sys.stderr)
        sys.exit(1)

def encode_scale_drivers(scale_drivers):
    """Convert scale drivers to numerical values for model input"""
    # Default values if not provided
    prec = 3.72  # Nominal
    flex = 3.04  # Nominal
    resl = 4.24  # Nominal
    team = 3.29  # Nominal
    pmat = 4.68  # Nominal
    
    # Value mappings
    value_map = {
        'Very Low': 6,
        'Low': 5,
        'Nominal': 4,
        'High': 3,
        'Very High': 2,
        'Extra High': 1
    }
    
    # Update values if provided
    if 'precedentedness' in scale_drivers:
        prec_key = scale_drivers['precedentedness']
        prec = value_map.get(prec_key, 4)
    
    if 'developmentFlexibility' in scale_drivers:
        flex_key = scale_drivers['developmentFlexibility']
        flex = value_map.get(flex_key, 4)
    
    if 'architectureResolution' in scale_drivers:
        resl_key = scale_drivers['architectureResolution']
        resl = value_map.get(resl_key, 4)
    
    if 'teamCohesion' in scale_drivers:
        team_key = scale_drivers['teamCohesion']
        team = value_map.get(team_key, 4)
    
    if 'processMaturiy' in scale_drivers:
        pmat_key = scale_drivers['processMaturiy']
        pmat = value_map.get(pmat_key, 4)
    
    return [prec, flex, resl, team, pmat]

def encode_cost_drivers(cost_drivers):
    """Convert cost drivers to numerical values for model input"""
    # Default all to 'Nominal' (encoded as 3)
    default_value = 3
    driver_values = []
    
    # List of all possible cost drivers in order expected by model
    all_drivers = [
        'reliability', 'databaseSize', 'complexity', 'reusability', 'documentation',
        'executionTimeConstraint', 'storageConstraint', 'platformVolatility',
        'analystCapability', 'programmerCapability', 'applicationExperience',
        'platformExperience', 'languageExperience', 'toolUse', 
        'multisiteDevelopment', 'schedule'
    ]
    
    # Value mappings (1=Very Low, 2=Low, 3=Nominal, 4=High, 5=Very High, 6=Extra High)
    value_map = {
        'Very Low': 1,
        'Low': 2,
        'Nominal': 3,
        'High': 4,
        'Very High': 5,
        'Extra High': 6
    }
    
    # Encode each driver
    for driver in all_drivers:
        if driver in cost_drivers:
            driver_value = value_map.get(cost_drivers[driver], default_value)
        else:
            driver_value = default_value
        
        driver_values.append(driver_value)
    
    return driver_values

def predict_advanced(params):
    """Predict effort using advanced COCOMO II model"""
    try:
        # Parse parameters
        size = params['size']
        sizing_method = params.get('sizingMethod', 'SLOC')
        scale_drivers = params.get('scaleDrivers', {})
        cost_drivers = params.get('costDrivers', {})
        unadjusted_fp = params.get('unadjustedFP', 0)
        sced = params.get('sced', 0)
        rcpx = params.get('rcpx', 0)
        risk_analysis = params.get('riskAnalysis', False)
        
        # Path to the model
        model_path = os.path.join(os.path.dirname(__file__), 'cocomo_advanced_model.pkl')
        
        # Load the trained model
        model = load_model(model_path)
        
        # Adjust size if using Function Points
        if sizing_method == 'Function Points':
            # Convert FP to SLOC (this multiplier depends on language)
            fp_to_sloc = 50
            size = unadjusted_fp * fp_to_sloc
        
        # Apply RCPX adjustment
        if rcpx:
            size = size * (1 + (rcpx / 100))
        
        # Encode scale drivers and cost drivers
        encoded_scale_drivers = encode_scale_drivers(scale_drivers)
        encoded_cost_drivers = encode_cost_drivers(cost_drivers)
        
        # Create feature array for prediction
        # Format: [size, scale_drivers..., cost_drivers...]
        features = np.array([[size] + encoded_scale_drivers + encoded_cost_drivers])
        
        # Make prediction using model
        effort = float(model.predict(features)[0])
        
        # Apply SCED adjustment if needed
        if sced:
            effort = effort * (1 + (sced / 100))
        
        # Calculate scale factor (sum of scale drivers)
        scale_factor = sum(encoded_scale_drivers)
        
        # Calculate exponent for schedule calculation
        exponent = 0.91 + 0.01 * scale_factor
        
        # Calculate schedule
        schedule = 3.67 * (effort ** (0.28 + 0.2 * (exponent - 0.91)))
        
        # Calculate team size
        team_size = effort / schedule
        
        # Calculate weeks
        weeks = schedule * 4.33  # Approximately 4.33 weeks per month
        
        # Determine project category
        if effort < 2:
            project_category = "Very Small"
        elif effort < 8:
            project_category = "Small"
        elif effort < 24:
            project_category = "Medium"
        elif effort < 300:
            project_category = "Large"
        else:
            project_category = "Very Large"
        
        # Prepare result
        result = {
            'effort': effort,
            'schedule': schedule,
            'teamSize': team_size,
            'weeks': weeks,
            'projectCategory': project_category,
            'currentUser': 'Huy-VNNIC',
            'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Add Monte Carlo risk analysis if requested
        if risk_analysis:
            monte_carlo_results = perform_monte_carlo(size, encoded_scale_drivers, encoded_cost_drivers, model)
            result['riskAnalysis'] = monte_carlo_results
        
        print(json.dumps(result))
        return 0
    
    except Exception as e:
        print(f"Error in advanced prediction: {str(e)}", file=sys.stderr)
        sys.exit(1)

def perform_monte_carlo(size, scale_drivers, cost_drivers, model, iterations=1000):
    """Perform Monte Carlo simulation for risk analysis"""
    efforts = []
    schedules = []
    team_sizes = []
    
    # Size variation (±15%)
    size_variation = 0.15
    
    # Driver variation (±1 category)
    driver_variation = 1
    
    for _ in range(iterations):
        # Randomize size
        random_size = size * (1 + np.random.uniform(-size_variation, size_variation))
        
        # Randomize scale drivers (with constraints)
        random_scale_drivers = []
        for val in scale_drivers:
            # Add random variation but keep within bounds (1-6)
            new_val = val + np.random.randint(-driver_variation, driver_variation + 1)
            random_scale_drivers.append(max(1, min(6, new_val)))
        
        # Randomize cost drivers (with constraints)
        random_cost_drivers = []
        for val in cost_drivers:
            # Add random variation but keep within bounds (1-6)
            new_val = val + np.random.randint(-driver_variation, driver_variation + 1)
            random_cost_drivers.append(max(1, min(6, new_val)))
        
        # Create features for this iteration
        features = np.array([[random_size] + random_scale_drivers + random_cost_drivers])
        
        # Predict effort
        effort = float(model.predict(features)[0])
        efforts.append(effort)
        
        # Calculate scale factor for schedule calculation
        scale_factor = sum(random_scale_drivers)
        exponent = 0.91 + 0.01 * scale_factor
        
        # Calculate schedule
        schedule = 3.67 * (effort ** (0.28 + 0.2 * (exponent - 0.91)))
        schedules.append(schedule)
        
        # Calculate team size
        team_size = effort / schedule
        team_sizes.append(team_size)
    
    # Sort results for percentile calculations
    efforts.sort()
    schedules.sort()
    team_sizes.sort()
    
    # Calculate percentiles
    def get_percentile(data, percentile):
        index = int(len(data) * percentile / 100)
        return data[index]
    
    return {
        'effort': {
            'min': efforts[0],
            'p10': get_percentile(efforts, 10),
            'p50': get_percentile(efforts, 50),
            'p90': get_percentile(efforts, 90),
            'max': efforts[-1]
        },
        'schedule': {
            'min': schedules[0],
            'p10': get_percentile(schedules, 10),
            'p50': get_percentile(schedules, 50),
            'p90': get_percentile(schedules, 90),
            'max': schedules[-1]
        },
        'teamSize': {
            'min': team_sizes[0],
            'p10': get_percentile(team_sizes, 10),
            'p50': get_percentile(team_sizes, 50),
            'p90': get_percentile(team_sizes, 90),
            'max': team_sizes[-1]
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict_advanced.py <json_params>", file=sys.stderr)
        sys.exit(1)
    
    params = json.loads(sys.argv[1])
    sys.exit(predict_advanced(params))