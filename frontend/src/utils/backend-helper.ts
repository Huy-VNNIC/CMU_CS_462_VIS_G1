/**
 * Helper functions for interacting with backend APIs
 */

/**
 * Format status messages with current date/time
 */
export const formatStatusMessage = (message: string) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${message} (${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC)`;
};

/**
 * Check backend status
 */
export const checkBackendStatus = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'GET' });
    return response.ok;
  } catch (error) {
    console.error('Backend check error:', error);
    return false;
  }
};

/**
 * Calculate project category based on effort
 */
export const getProjectCategory = (effort: number): string => {
  if (effort < 2) return "Very Small";
  if (effort < 8) return "Small";
  if (effort < 24) return "Medium";
  if (effort < 300) return "Large";
  return "Very Large";
};

/**
 * Get recommended team size
 */
export const getRecommendedTeamSize = (teamSize: number): number => {
  return Math.round(teamSize);
};