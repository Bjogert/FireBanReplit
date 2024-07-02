// src/components/ResultDisplay.jsx
import React from 'react';

const ResultDisplay = ({ fireHazard, fireBan, detailsVisible, setDetailsVisible, showMoreInfo, setShowMoreInfo }) => (
  <div>
    {fireHazard && (
      <div className="result-box">
        <div className="fire-hazard-level">
          <strong>Fire Hazard Level:</strong> {fireHazard.level}
        </div>
        <div className="fire-ban-status">
          <strong>Fire Ban Status:</strong> {fireBan.status}
        </div>
        <div className="revision-date">
          <strong>Last Updated:</strong> {fireBan.revisionDate ? formatFireBanUpdateDate(fireBan.revisionDate) : "Information not available."}
        </div>
      </div>
    )}
    {detailsVisible && fireHazard && (
      <div className="result-box detailed-info-box">
        <div className="collapsible-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
          <strong>More Information</strong>
          <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
        </div>
        {showMoreInfo && (
          <div className="collapsible-content show">
            <ul>
              <li><strong>Current Situation:</strong> {fireHazard.fwiMessage || "Information not available."}</li>
              <li><strong>Combustible Material:</strong> {fireHazard.combustibleMessage || "Information not available."}</li>
              <li><strong>Grass Fire Risk:</strong> {fireHazard.grassMessage || "Information not available."}</li>
              <li><strong>Forest & Field:</strong> {fireHazard.woodMessage || "Information not available."}</li>
              <li><strong>General Risk:</strong> {fireHazard.riskMessage || "Information not available."}</li>
            </ul>
          </div>
        )}
      </div>
    )}
  </div>
);

export default ResultDisplay;
