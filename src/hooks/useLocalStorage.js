import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      // Dispatch custom event for cross-component communication
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wrapper function to update state and localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function for state updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  };

  // Function to remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;