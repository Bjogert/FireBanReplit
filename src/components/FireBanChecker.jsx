// src/components/FireBanChecker.jsx
import React, { useState } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Check Status");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleCheckStatus = async () => {
    if (buttonText === "Check Status") {
      setButtonText("Checking...");
      setButtonClass("loading");
      setError(null);
      setFireHazard(null);
      setFireBan(null);

      try {
        const { coords } = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = coords;

        const fireBanData = await fetchFireBanData(latitude, longitude);
        const fireProhibitionData = await fetchFireProhibitionData(latitude, longitude);

        setFireHazard(fireBanData);
        setFireBan(fireProhibitionData);

        setButtonText("More Information");
        setButtonClass("");
      } catch (error) {
        setError('Failed to fetch data');
        setButtonText("Check Status");
        setButtonClass("");
      }
    } else {
      setDetailsVisible(true); // Show the detailed information box
      setShowMoreInfo(!showMoreInfo); // Toggle collapse/expand
    }
  };

  return (
    <div>
      <main className="main">
        <button 
          id="check-button" 
          className={`check-button ${buttonClass}`} 
          onClick={handleCheckStatus}
        >
          {buttonText}
        </button>
        {error && <div className="result error-message">{error}</div>}
        {fireBan && (
          <div className="result-box">
            <div><strong>Det råder</strong> {fireBan.status || "Information not available."}</div>
            <div><strong>Kommun:</strong> {fireBan.county || "Information not available."}</div> {/* Display county under the label "Kommun" */}
          </div>
        )}
        {detailsVisible && (
          <div className="result-box">
            <div className="collapsible-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
              <strong>Detailed Information</strong>
              <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
            </div>
            {showMoreInfo && fireHazard && (
              <div className="collapsible-content show">
                <ul>
                  <li><strong>FWI Message:</strong> {fireHazard.fwiMessage || "Information not available."}</li>
                  <li><strong>Combustible Message:</strong> {fireHazard.combustibleMessage || "Information not available."}</li>
                  <li><strong>Grass Message:</strong> {fireHazard.grassMessage || "Information not available."}</li>
                  <li><strong>Wood Message:</strong> {fireHazard.woodMessage || "Information not available."}</li>
                  <li><strong>General Risk Message:</strong> {fireHazard.riskMessage || "Information not available."}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FireBanChecker;