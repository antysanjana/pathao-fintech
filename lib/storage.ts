const STORAGE_KEY = 'json-tree:data';
const EXPANDED_KEY = 'json-tree:expanded';

const DEFAULT_DATA = {
  "auto": {
    "driver_types": {
      "auto": true,
      "img_url": "",
      "is_active": true,
      "is_open_for_signup": true,
      "name": {
        "bn": "",
        "en": ""
      }
    },
    "verify_otp_for_signup": false
  }
};

export function loadData(): any {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  
  return DEFAULT_DATA;
}

export function saveData(data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function loadExpandedState(): Set<string> {
  if (typeof window === 'undefined') return new Set(['root']);
  
  try {
    const stored = localStorage.getItem(EXPANDED_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error loading expanded state from localStorage:', error);
  }
  
  return new Set(['root']);
}

export function saveExpandedState(expanded: Set<string>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(EXPANDED_KEY, JSON.stringify(Array.from(expanded)));
  } catch (error) {
    console.error('Error saving expanded state to localStorage:', error);
  }
}
