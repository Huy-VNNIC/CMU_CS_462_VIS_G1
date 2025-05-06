import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputField from './components/InputField';
import ScaleDrivers from './components/ScaleDrivers';
import CostDrivers from './components/CostDrivers';
import ResultCard from './components/ResultCard';
import Dropdown from './components/Dropdown';
import ThemeToggle from './components/ThemeToggle'; // Import component mới

import { fetchCocomoDrivers, calculateDetailed } from './services/api';
import { 
  ScaleDrivers as ScaleDriversType, 
  CostDrivers as CostDriversType, 
  CocomoAdvancedResult,
  ModeType,
  SizingMethod,
  DropdownOption
} from './models/types';

import './App.css';

function App() {
  const [drivers, setDrivers] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [results, setResults] = useState<CocomoAdvancedResult | null>(null);
  const [monteCarloOn, setMonteCarloOn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Thêm state cho dark mode
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  
  // Form state
  const [size, setSize] = useState<number>(50000);
  const [sizingMethod, setSizingMethod] = useState<SizingMethod>('SLOC');
  const [mode, setMode] = useState<ModeType>('SLDC');
  const [a, setA] = useState<number>(3.0);
  const [b, setB] = useState<number>(1.0);
  const [sced, setSced] = useState<number>(6);
  const [rcpx, setRcpx] = useState<number>(15);
  const [unadjustedFP, setUnadjustedFP] = useState<number>(13);
  const [unadustedFP, setUnadustedFP] = useState<number>(98);
  const [scaleDrivers, setScaleDrivers] = useState<ScaleDriversType>({});
  const [costDrivers, setCostDrivers] = useState<CostDriversType>({});

  useEffect(() => {
    // Fetch drivers when component mounts
    const getDrivers = async () => {
      try {
        const driversData = await fetchCocomoDrivers();
        setDrivers(driversData);
      } catch (err) {
        setError('Failed to load COCOMO drivers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getDrivers();
  }, []);
  
  // Thêm useEffect để áp dụng dark mode
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Update mode and automatically adjust a and b values
  const handleModeChange = (selectedMode: string) => {
    setMode(selectedMode as ModeType);
    
    switch (selectedMode) {
      case 'organic':
        setA(2.4);
        setB(1.05);
        break;
      case 'semi-detached':
        setA(3.0);
        setB(1.12);
        break;
      case 'embedded':
        setA(3.6);
        setB(1.2);
        break;
      default:
        // Keep current values for SLDC mode
        break;
    }
  };

  // Handle scale driver changes  
  const handleScaleDriverChange = (name: string, value: string) => {
    setScaleDrivers(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle cost driver changes
  const handleCostDriverChange = (name: string, value: string) => {
    setCostDrivers(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form for calculation
  const handleCalculate = async () => {
    try {
      setCalculating(true);
      setError(null);
      
      const formData = {
        size,
        sizingMethod,
        mode,
        a,
        b,
        sced,
        rcpx,
        unadjustedFP,
        unadustedFP,
        scaleDrivers,
        costDrivers,
        riskAnalysis: monteCarloOn
      };
      
      const response = await calculateDetailed(formData);
      
      if (response.success && response.result) {
        setResults(response.result);
      } else {
        setError(response.error || 'Calculation failed');
      }
    } catch (err) {
      setError('Error performing calculation');
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading COCOMO II Calculator...</div>;
  }

  // Options for dropdowns
  const monteCarloOptions: DropdownOption[] = [
    { value: 'Off', label: 'Off' },
    { value: 'On', label: 'On' }
  ];
  
  const sizingMethodOptions: DropdownOption[] = [
    { value: 'SLOC', label: 'Source Lines of Code' },
    { value: 'Function Points', label: 'Function Points' }
  ];
  
  const modeOptions: DropdownOption[] = [
    { value: 'SLDC', label: 'SLDC' },
    { value: 'organic', label: 'Organic' },
    { value: 'semi-detached', label: 'Semi-detached' },
    { value: 'embedded', label: 'Embedded' }
  ];

  return (
    <div className="App">
      <Header title="COCOMO II - Constructive Cost Model">
        <div className="header-controls">
          {/* Thêm ThemeToggle component */}
          <ThemeToggle isDark={isDarkTheme} toggle={toggleTheme} />
          <div className="monte-carlo-toggle">
            <Dropdown 
              label="Monte Carlo Risk"
              options={monteCarloOptions}
              value={monteCarloOn ? 'On' : 'Off'}
              onChange={(value) => setMonteCarloOn(value === 'On')}
            />
          </div>
        </div>
      </Header>

      {error && <div className="error-message">{error}</div>}

      <div className="app-content">
        <div className="form-container">
          <h2>Input Parameters</h2>
          
          <div className="form-section">
            <div className="form-row size-row">
              <InputField
                label="Software Size"
                type="number"
                value={size}
                onChange={(value) => setSize(Number(value))}
              />
              
              <div className="input-group">
                <Dropdown
                  label="Sizing Method"
                  options={sizingMethodOptions}
                  value={sizingMethod}
                  onChange={(value) => setSizingMethod(value as SizingMethod)}
                />
              </div>
            </div>
            
            <div className="form-row mode-row">
              <div className="mode-params">
                <InputField
                  label="SLDC"
                  value={mode}
                  readOnly={true}
                />
                <InputField
                  label="a"
                  type="number"
                  step={0.1}
                  value={a}
                  onChange={(value) => setA(Number(value))}
                />
                <InputField
                  label="b"
                  type="number"
                  step={0.1}
                  value={b}
                  onChange={(value) => setB(Number(value))}
                />
                <InputField
                  label="SCED %"
                  type="number"
                  value={sced}
                  onChange={(value) => setSced(Number(value))}
                />
                <InputField
                  label="RCPX %"
                  type="number"
                  value={rcpx}
                  onChange={(value) => setRcpx(Number(value))}
                />
              </div>
              
              <div className="mode-select">
                <Dropdown
                  label="Mode"
                  options={modeOptions}
                  value={mode}
                  onChange={handleModeChange}
                />
              </div>
            </div>
            
            <div className="form-row fp-row">
              <InputField
                label="Unadjusted Functionality"
                type="number"
                value={unadjustedFP}
                onChange={(value) => setUnadjustedFP(Number(value))}
              />
              <InputField
                label="Unadusted Functionality"
                type="number"
                value={unadustedFP}
                onChange={(value) => setUnadustedFP(Number(value))}
              />
            </div>
          </div>
          
          <h3>Software Scale Drivers</h3>
          {drivers && (
            <ScaleDrivers 
              drivers={drivers.scaleDrivers} 
              onChange={handleScaleDriverChange}
              values={scaleDrivers}
            />
          )}
          
          <h3>Software Cost Drivers</h3>
          {drivers && (
            <CostDrivers 
              drivers={drivers.costDrivers} 
              onChange={handleCostDriverChange}
              values={costDrivers}
            />
          )}
          
          <div className="form-actions">
            <button 
              className="calculate-btn"
              onClick={handleCalculate}
              disabled={calculating}
            >
              {calculating ? 'Calculating...' : 'Calculate Effort'}
            </button>
          </div>
        </div>
        
        {results && (
          <div className="results-container">
            <ResultCard results={results} />
          </div>
        )}
      </div>
      
      <footer className="app-footer">
        <div className="user-info">
          <span>Current User: Huy, Minh, Duy, Tra</span>
          <span>Date & Time: 2025-05-05 19:06:07 (UTC)</span>
          <span>Backend Status: Online</span>
        </div>
      </footer>
    </div>
  );
}

export default App;