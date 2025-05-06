// Basic types
export interface DropdownOption {
  value: string;
  label: string;
}

// Component Props
export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export interface InputFieldProps {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  step?: number;
}

export interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

// COCOMO II Model types
export type SizingMethod = 'SLOC' | 'Function Points';
export type ModeType = 'SLDC' | 'organic' | 'semi-detached' | 'embedded';
export type RatingLevel = 'Very Low' | 'Low' | 'Nominal' | 'High' | 'Very High' | 'Extra High';

export interface ScaleDrivers {
  precedentedness?: RatingLevel;
  developmentFlexibility?: RatingLevel;
  architectureResolution?: RatingLevel;
  teamCohesion?: RatingLevel;
  processMaturiy?: RatingLevel;
}

export interface CostDrivers {
  // Product factors
  reliability?: RatingLevel;
  databaseSize?: Exclude<RatingLevel, 'Very Low' | 'Extra High'>;
  complexity?: RatingLevel;
  reusability?: Exclude<RatingLevel, 'Very Low'>;
  documentation?: RatingLevel;
  
  // Platform factors
  executionTimeConstraint?: Exclude<RatingLevel, 'Very Low' | 'Low'>;
  storageConstraint?: Exclude<RatingLevel, 'Very Low' | 'Low'>;
  platformVolatility?: Exclude<RatingLevel, 'Very Low' | 'Extra High'>;
  
  // Personnel factors
  analystCapability?: RatingLevel;
  programmerCapability?: RatingLevel;
  applicationExperience?: RatingLevel;
  platformExperience?: RatingLevel;
  languageExperience?: RatingLevel;
  
  // Project factors
  toolUse?: RatingLevel;
  multisiteDevelopment?: RatingLevel;
  schedule?: RatingLevel;
}

export interface CocomoAdvancedInput {
  size: number;
  sizingMethod: SizingMethod;
  mode?: ModeType;
  a?: number;
  b?: number;
  sced?: number;
  rcpx?: number;
  unadjustedFP?: number;
  unadustedFP?: number;
  scaleDrivers?: ScaleDrivers;
  costDrivers?: CostDrivers;
  riskAnalysis?: boolean;
}

export interface MonteCarloResult {
  min: number;
  p10: number;
  p50: number;
  p90: number;
  max: number;
}

export interface RiskAnalysisResults {
  effort: MonteCarloResult;
  schedule: MonteCarloResult;
  teamSize: MonteCarloResult;
}

export interface CocomoAdvancedResult {
  effort: number;
  schedule: number;
  teamSize: number;
  projectCategory: string;
  weeks: number;
  currentUser: string;
  timestamp: string;
  riskAnalysis?: RiskAnalysisResults;
}