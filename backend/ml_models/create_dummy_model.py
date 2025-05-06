#!/usr/bin/env python3
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression
import os

def create_basic_model():
    """Create a simple linear regression model as a placeholder"""
    # Generate some synthetic COCOMO data
    sizes = np.array([10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000])
    modes = np.array([1, 2, 3, 1, 2, 3, 1, 2, 3, 1])  # 1=organic, 2=semi-detached, 3=embedded
    reliability = np.array([1.0, 1.1, 1.2, 1.3, 1.0, 1.1, 1.2, 1.3, 1.0, 1.1])
    complexity = np.array([1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.0, 1.1, 1.2, 1.3])
    
    # Calculate efforts using traditional COCOMO formulas
    efforts = []
    for i in range(len(sizes)):
        size_in_kloc = sizes[i] / 1000
        if modes[i] == 1:  # organic
            a, b = 2.4, 1.05
        elif modes[i] == 2:  # semi-detached
            a, b = 3.0, 1.12
        else:  # embedded
            a, b = 3.6, 1.20
        
        effort = a * (size_in_kloc ** b) * reliability[i] * complexity[i]
        efforts.append(effort)
    
    efforts = np.array(efforts)
    
    # Create and train a linear regression model
    X = np.column_stack((sizes, modes, reliability, complexity))
    model = LinearRegression()
    model.fit(X, efforts)
    
    # Save the model
    directory = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(directory, 'cocomo_basic_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
    
    print("Created basic COCOMO model placeholder")
    
    # Also create an advanced model placeholder
    create_advanced_model()

def create_advanced_model():
    """Create a more complex regression model for advanced COCOMO"""
    # Generate 100 samples of synthetic data
    np.random.seed(42)
    samples = 100
    
    # Features:
    # 1. Size (5K to 500K)
    sizes = np.random.uniform(5000, 500000, samples)
    
    # 2. Scale drivers (5 features, values 1-6)
    scale_drivers = np.random.randint(1, 7, (samples, 5))
    
    # 3. Cost drivers (16 features, values 1-6)
    cost_drivers = np.random.randint(1, 7, (samples, 16))
    
    # Combine all features
    X = np.column_stack((sizes.reshape(-1, 1), scale_drivers, cost_drivers))
    
    # Calculate target efforts using COCOMO II formulas
    efforts = []
    for i in range(samples):
        # Size in KLOC
        size_in_kloc = sizes[i] / 1000
        
        # Calculate scale factor (sum of scale drivers)
        scale_factor = sum(scale_drivers[i])
        
        # Calculate exponent
        exponent = 0.91 + 0.01 * scale_factor
        
        # Base effort
        base_effort = 2.94 * (size_in_kloc ** exponent)
        
        # Apply effort multipliers (simplified for dummy model)
        em = 1.0
        for j in range(len(cost_drivers[i])):
            # Convert cost driver value (1-6) to multiplier
            # 1=Very Low: 1.3, 2=Low: 1.15, 3=Nominal: 1.0, 4=High: 0.85, 5=Very High: 0.7, 6=Extra High: 0.55
            multipliers = [1.3, 1.15, 1.0, 0.85, 0.7, 0.55]
            em *= multipliers[cost_drivers[i][j] - 1]
        
        # Final effort
        effort = base_effort * em
        efforts.append(effort)
    
    efforts = np.array(efforts)
    
    # Create and train a linear regression model
    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, efforts)
    
    # Save the model
    directory = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(directory, 'cocomo_advanced_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
    
    print("Created advanced COCOMO model placeholder")

if __name__ == "__main__":
    create_basic_model()
    print("Dummy models created successfully")