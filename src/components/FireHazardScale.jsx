import React from 'react';
import '../FireHazardScale.css';

const FireHazardScale = ({ level }) => {
  const levels = [
    { label: 'Ingen data', className: 'grey' },
    { label: 'Minimal risk', className: 'blue' },
    { label: 'Låg risk', className: 'green' },
    { label: 'Måttlig risk', className: 'yellow' },
    { label: 'Hög risk', className: 'orange' },
    { label: 'Mycket hög risk', className: 'red' },
    { label: 'Extrem risk', className: 'darkred' },
  ];

  return (
    <div className="scale-container">
      <input
        type="text"
        className="text-box"
        value={levels[level] ? levels[level].label : 'Ingen data'}
        readOnly
      />
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
    </div>
  );
};

export default FireHazardScale;