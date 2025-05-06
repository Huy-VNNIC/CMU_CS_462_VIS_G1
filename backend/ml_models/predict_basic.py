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

def predict_effort(size, mode, reliability, complexity):
    """Predict effort using trained model"""
    try:
        # Path to the model
        model_path = os.path.join(os.path.dirname(__file__), 'cocomo_basic_model.pkl')
        
        # Load the trained model
        model = load_model(model_path)
        
        # Convert mode to numerical value
        mode_map = {'organic': 1, 'semi-detached': 2, 'embedded': 3}
        mode_num = mode_map.get(mode.lower(), 3)  # Default to embedded
        
        # Create feature array for prediction
        features = np.array([[size, mode_num, float(reliability), float(complexity)]])
        
        # Make prediction
        effort = float(model.predict(features)[0])
        
        # Calculate schedule using standard formula (could also be predicted by a model)
        if mode.lower() == 'organic':
            schedule = 2.5 * (effort ** 0.38)
        elif mode.lower() == 'semi-detached':
            schedule = 2.5 * (effort ** 0.35)
        else:  # embedded
            schedule = 2.5 * (effort ** 0.32)
        
        # Calculate team size
        team_size = effort / schedule
        
        # Return results as JSON
        result = {
            'effort': effort,
            'schedule': schedule,
            'teamSize': team_size
        }
        
        print(json.dumps(result))
        return 0
    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python predict_basic.py <size> <mode> <reliability> <complexity>", file=sys.stderr)
        sys.exit(1)
    
    size = float(sys.argv[1])
    mode = sys.argv[2]
    reliability = float(sys.argv[3])
    complexity = float(sys.argv[4])
    
    sys.exit(predict_effort(size, mode, reliability, complexity))