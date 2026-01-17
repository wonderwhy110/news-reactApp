// components/Spinner.jsx (полностью inline)
import React from 'react';

function Spinner({ size = 20, color = '#3a87d5af' }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      minHeight: '200px',
     
      width: '100%',
    }}>
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `4px solid rgba(0, 0, 0, 0.1)`,
          borderRadius: '50%',
          borderTop: `4px solid ${color} `,
       
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      
      {/* Добавляем ключевые кадры как inline style */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Spinner;