// src/components/ThemeToggle/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";



const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Переключить на ${theme === "light" ? "тёмную" : "светлую"} тему`}
    >
      <div className={`theme-toggle__track ${theme}`}>
        <div className="theme-toggle__thumb">
          {theme === "light" ? (
            <span className="theme-toggle__icon">☀️</span>
          ) : (
            <span className="theme-toggle__icon">🌙</span>
          )}
        </div>
      </div>
      <span className="theme-toggle__label">
        {theme === "light" ? "Тёмная тема" : "Светлая тема"}
      </span>
    </button>
  );
};

export default ThemeToggle;