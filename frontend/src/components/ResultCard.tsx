import React from 'react';
import { CocomoAdvancedResult } from '../models/types';
import MonteCarloResults from './MonteCarloResults';

interface ResultCardProps {
  results: CocomoAdvancedResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ results }) => {
  if (!results) return null;
  
  return (
    <div className="result-card">
      <h2>Estimation Results</h2>
      
      <div className="result-item">
        <div className="result-label">Effort Estimate</div>
        <div className="result-value">
          {results.effort.toFixed(2)} person-months
        </div>
      </div>
      
      <div className="result-item">
        <div className="result-label">Project Category</div>
        <div className="result-value">{results.projectCategory}</div>
      </div>
      
      <div className="result-item">
        <div className="result-label">Development Time</div>
        <div className="result-value">
          {results.schedule.toFixed(2)} months
        </div>
        <div className="result-note">
          Approximately {Math.round(results.weeks)} weeks
        </div>
      </div>
      
      <div className="result-item">
        <div className="result-label">Team Size (Average)</div>
        <div className="result-value">
          {results.teamSize.toFixed(2)} people
        </div>
        <div className="result-note">
          Recommended: {Math.round(results.teamSize)} full-time staff
        </div>
      </div>
      
      <div className="user-info">
        <div>Current User: {results.currentUser || "Huy-VNNIC"}</div>
        <div>Date & Time: {results.timestamp || "2025-05-05 18:52:04 (UTC)"}</div>
      </div>
      
      {/* Phần tích hợp Monte Carlo Results */}
      {results.riskAnalysis && (
        <MonteCarloResults riskAnalysis={results.riskAnalysis} />
      )}
    </div>
  );
};

export default ResultCard;