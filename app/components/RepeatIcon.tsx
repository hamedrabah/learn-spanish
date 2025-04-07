import React from 'react';

interface RepeatIconProps {
  onClick: () => void;
  className?: string;
}

const RepeatIcon: React.FC<RepeatIconProps> = ({ onClick, className }) => {
  return (
    <button 
      onClick={onClick}
      className={className}
      aria-label="Repetir Pregunta"
      title="Repetir Pregunta"
      style={{
        backgroundColor: '#171c2e',
        color: '#ffd54f',
        border: '2px solid #ffd54f',
        borderRadius: '8px',
        padding: '10px 18px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '18px',
        letterSpacing: '0.5px',
        fontFamily: "'Pirata One', cursive, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transition: 'all 0.3s ease',
        minWidth: '200px',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#232a46';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#171c2e';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
      }}
    >
      Repetir Pregunta
    </button>
  );
};

export default RepeatIcon; 