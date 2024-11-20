// AIPersonality is a set of weights that determine how an AI player will behave, all values are between 0 and 1
export interface AIPersonality {
  militaryAggression: number; // likelihood to prioritize red cards
  wonderFocus: number; // likelihood to prioritize wonder completion
  scienceFocus: number; // likelihood to prioritize green cards
  tradingPreference: number; // willingness to rely on trading rather than resource production
  neighborDisruption: number; // tendency to analyze and play cards that are more beneficial to neighboring players
}

export function generateAIPersonality(): AIPersonality {
  return {
    militaryAggression: Math.random(),
    wonderFocus: Math.random(),
    scienceFocus: Math.random(),
    tradingPreference: Math.random(),
    neighborDisruption: Math.random(),
  };
}

// For debugging and testing purposes
export const PRESET_PERSONALITIES = {
  balanced: {
    militaryAggression: 0.5,
    wonderFocus: 0.5,
    scienceFocus: 0.5,
    tradingPreference: 0.5,
    neighborDisruption: 0.5,
  },
  militaristic: {
    militaryAggression: 0.8,
    wonderFocus: 0.4,
    scienceFocus: 0.2,
    tradingPreference: 0.4,
    neighborDisruption: 0.7,
  },
  wonderFocused: {
    militaryAggression: 0.4,
    wonderFocus: 0.8,
    scienceFocus: 0.5,
    tradingPreference: 0.5,
    neighborDisruption: 0.3,
  },
  scientific: {
    militaryAggression: 0.3,
    wonderFocus: 0.6,
    scienceFocus: 0.8,
    tradingPreference: 0.2,
    neighborDisruption: 0.4,
  },
  mercantilistic: {
    militaryAggression: 0.2,
    wonderFocus: 0.7,
    scienceFocus: 0.5,
    tradingPreference: 0.8,
    neighborDisruption: 0.3,
  },
  disruptive: {
    militaryAggression: 0.6,
    wonderFocus: 0.5,
    scienceFocus: 0.2,
    tradingPreference: 0.4,
    neighborDisruption: 0.8,
  },
};
