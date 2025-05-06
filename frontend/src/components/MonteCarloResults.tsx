import React from 'react';
import { RiskAnalysisResults } from '../models/types';

interface MonteCarloResultsProps {
  riskAnalysis: RiskAnalysisResults;
}

const MonteCarloResults: React.FC<MonteCarloResultsProps> = ({ riskAnalysis }) => {
  if (!riskAnalysis) return null;
  
  return (
    <div className="monte-carlo-results">
      <h2>Monte Carlo Risk Analysis</h2>
      
      <div className="risk-tables">
        <div className="risk-table">
          <h3>Effort (Person-Months)</h3>
          <table>
            <thead>
              <tr>
                <th>10%</th>
                <th>50% (Median)</th>
                <th>90%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{riskAnalysis.effort.p10.toFixed(2)}</td>
                <td>{riskAnalysis.effort.p50.toFixed(2)}</td>
                <td>{riskAnalysis.effort.p90.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="risk-table">
          <h3>Schedule (Months)</h3>
          <table>
            <thead>
              <tr>
                <th>10%</th>
                <th>50% (Median)</th>
                <th>90%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{riskAnalysis.schedule.p10.toFixed(2)}</td>
                <td>{riskAnalysis.schedule.p50.toFixed(2)}</td>
                <td>{riskAnalysis.schedule.p90.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="risk-table">
          <h3>Team Size</h3>
          <table>
            <thead>
              <tr>
                <th>10%</th>
                <th>50% (Median)</th>
                <th>90%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{riskAnalysis.teamSize.p10.toFixed(2)}</td>
                <td>{riskAnalysis.teamSize.p50.toFixed(2)}</td>
                <td>{riskAnalysis.teamSize.p90.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="risk-description">
        <p>
          <strong>Interpretation:</strong> The 10% and 90% values represent the range within which we expect 
          your project metrics to fall with 80% confidence. For planning purposes, consider using the 90% 
          values to account for potential risks.
        </p>
      </div>
    </div>
  );
};

export default MonteCarloResults;