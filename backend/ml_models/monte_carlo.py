#!/usr/bin/env python3
import sys
import json
import pickle
import numpy as np
import os

def load_model(model_path):
    """Load a trained model from a .pkl file"""
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}", file=sys.stderr)
        sys.exit(1)

def monte_carlo_analysis(params):
    """Perform Monte Carlo analysis for COCOMO II"""
    try:
        # Parse parameters
        size = params['size']
        mode = params.get('mode', 'embedded')
        iterations = params.get('iterations', 1000)
        
        # Path to the model
        model_path = os.path.join(os.path.dirname(__file__), 'cocomo_basic_model.pkl')
        
        # Load the trained model if available, otherwise use basic formulas
        try:
            model = load_model(model_path)
            use_model = True
        except:
            use_model = False
        
        # Mode conversion
        mode_map = {'organic': 1, 'semi-detached': 2, 'embedded': 3}
        mode_num = mode_map.get(mode.lower(), 3)
        
        # Initialize arrays for results
        efforts = []
        schedules = []
        costs = []
        team_sizes = []
        
        # COCOMO coefficients based on mode
        if mode.lower() == 'organic':
            a, b = 2.4, 1.05
        elif mode.lower() == 'semi-detached':
            a, b = 3.0, 1.12
        else:  # embedded
            a, b = 3.6, 1.20
        
        # Run iterations
        for _ in range(iterations):
            # Size variation (±20%)
            random_size = size * (1 + np.random.uniform(-0.2, 0.2))
            
            # Coefficient variation (±15%)
            random_a = a * (1 + np.random.uniform(-0.15, 0.15))
            
            # Random reliability and complexity factors (0.7 to 1.65)
            random_reliability = np.random.uniform(0.7, 1.65)
            random_complexity = np.random.uniform(0.7, 1.65)
            
            if use_model:
                # Use machine learning model for prediction
                features = np.array([[random_size, mode_num, random_reliability, random_complexity]])
                effort = float(model.predict(features)[0])
            else:
                # Use basic COCOMO formula
                effort = random_a * (random_size / 1000) ** b * random_reliability * random_complexity
            
            efforts.append(effort)
            
            # Calculate schedule
            schedule = 2.5 * (effort ** (0.32 + 0.2 * (b - 0.91)))
            schedules.append(schedule)
            
            # Calculate team size
            team_size = effort / schedule
            team_sizes.append(team_size)
            
            # Calculate cost (assuming $10k per person-month)
            cost = effort * 10000
            costs.append(cost)
        
        # Sort results for percentile calculations
        efforts.sort()
        schedules.sort()
        team_sizes.sort()
        costs.sort()
        
        # Calculate percentiles
        def get_percentile(data, percentile):
            index = int(len(data) * percentile / 100)
            return data[index]
        
        result = {
            'effort': {
                'min': efforts[0],
                'p10': get_percentile(efforts, 10),
                'p25': get_percentile(efforts, 25),
                'p50': get_percentile(efforts, 50),
                'p75': get_percentile(efforts, 75),
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
            },
            'cost': {
                'min': costs[0],
                'p10': get_percentile(costs, 10),
                'p50': get_percentile(costs, 50),
                'p90': get_percentile(costs, 90),
                'max': costs[-1]
            }
        }
        
        print(json.dumps(result))
        return 0
    
    except Exception as e:
        print(f"Error in Monte Carlo analysis: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python monte_carlo.py <json_params>", file=sys.stderr)
        sys.exit(1)
    
    params = json.loads(sys.argv[1])
    sys.exit(monte_carlo_analysis(params))