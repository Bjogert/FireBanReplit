import React from 'react';
import '../FireHazardScale.css';

const FireHazardScale = ({ level }) => {
  const levels = [
    { label: 'Ingen data', className: 'grey' },
    { label: 'Mycket liten risk', className: 'blue' },
    { label: 'Liten risk', className: 'green' },
    { label: 'Måttlig risk', className: 'yellow' },
    { label: 'Stor risk', className: 'orange' },
    { label: 'Mycket stor risk', className: 'red' },
    { label: 'Extremt stor risk', className: 'darkred' },
  ];

  return (
    <div className="fire-hazard-scale-container">
      <div className="fire-hazard-scale">
        {levels.map((lvl, index) => (
          <div
            key={index}
            className={`scale-segment ${level === index ? 'active' : ''} ${lvl.className}`}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default FireHazardScale;