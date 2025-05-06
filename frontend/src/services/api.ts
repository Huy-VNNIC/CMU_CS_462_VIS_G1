import { 
  CocomoAdvancedInput, 
  CocomoAdvancedResult,
  MonteCarloResult
} from '../models/types';

const API_BASE_URL = 'http://localhost:3008';

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
}

export interface MonteCarloResponse {
  effort: MonteCarloResult;
  schedule: MonteCarloResult;
  teamSize: MonteCarloResult;
  cost: MonteCarloResult;
}

export const fetchCocomoDrivers = async (): Promise<{
  scaleDrivers: Record<string, string[]>;
  costDrivers: Record<string, string[]>;
  sizingMethods: string[];
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cocomo/drivers`);
    const data = await response.json();
    return data.drivers || {
      scaleDrivers: {},
      costDrivers: {},
      sizingMethods: ['SLOC', 'Function Points']
    };
  } catch (error) {
    console.error('Error fetching COCOMO drivers:', error);
    return {
      scaleDrivers: {},
      costDrivers: {},
      sizingMethods: ['SLOC', 'Function Points']
    };
  }
};

export const calculateDetailed = async (
  params: CocomoAdvancedInput
): Promise<ApiResponse<CocomoAdvancedResult>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cocomo/detailed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error calculating detailed COCOMO:', error);
    return {
      success: false,
      error: 'Failed to calculate detailed effort'
    };
  }
};

export const calculateMonteCarloRisk = async (params: {
  size: number;
  mode: string;
  iterations?: number;
}): Promise<ApiResponse<MonteCarloResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cocomo/monte-carlo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error calculating Monte Carlo risk:', error);
    return {
      success: false,
      error: 'Failed to perform risk analysis'
    };
  }
};