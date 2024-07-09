import React, { useState } from 'react';
import '../FireHazardInfoBox.css'; // Import the new CSS file

const FireHazardInfoBox = ({ fireHazard }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <div className="fh-box">
      <div className="fh-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
        <strong>Mer Information</strong>
        <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
      </div>
      {showMoreInfo && (
        <div className="fh-content show">
          <ul>
            <li><strong>Aktuellt Läge:</strong> {fireHazard.fwiMessage || "Information not available."}</li>
            <li><strong>Brandsäkerhet:</strong> {fireHazard.combustibleMessage || "Information not available."}</li>
            <li><strong>I Skog & Mark:</strong> {fireHazard.woodMessage || "Information not available."}</li>
            <li><strong>Brandrisk Gräs:</strong> {fireHazard.grassMessage || "Information not available."}</li>
            <li><strong>Generellt:</strong> {fireHazard.riskMessage || "Information not available."}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FireHazardInfoBox;