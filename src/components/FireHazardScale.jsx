import React from 'react';
import '../FireHazardScale.css';

const FireHazardScale = ({ level }) => {
  const levels = [
    { label: 'Ingen data', color: 'grey' },
    { label: 'Mycket liten risk', color: 'blue' },
    { label: 'Liten risk', color: 'green' },
    { label: 'Måttlig risk', color: 'yellow' },
    { label: 'Stor risk', color: 'orange' },
    { label: 'Mycket stor risk', color: 'red' },
    { label: 'Extremt stor risk', color: 'darkred' },
  ];

  return (
    <div className="fire-hazard-scale-container">
      <div className="fire-hazard-scale">
        {levels.map((lvl, index) => (
          <div
            key={index}
            className={`scale-segment ${level === index ? 'active' : ''}`}
            style={{ backgroundColor: lvl.color }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default FireHazardScale;