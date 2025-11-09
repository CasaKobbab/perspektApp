import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/entities/User';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Try to get user preference first
        const currentUser = await User.me();
        const userTheme = currentUser.preferred_theme;
        
        if (userTheme) {
          setTheme(userTheme);
        } else {
          // Fallback to localStorage or system preference
          const savedTheme = localStorage.getItem('preferred_theme');
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          setTheme(savedTheme || systemTheme);
        }
      } catch (error) {
        // User not logged in, use localStorage or system preference
        const savedTheme = localStorage.getItem('preferred_theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(savedTheme || systemTheme);
      }
      setIsLoading(false);
    };

    initializeTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('preferred_theme', newTheme);

    // Save to user profile if logged in
    try {
      await User.me(); // Check if logged in
      await User.updateMyUserData({ preferred_theme: newTheme });
    } catch (error) {
      // User not logged in, localStorage is enough
    }

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50" />; // Simple loading state
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}