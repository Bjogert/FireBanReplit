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

  const handleCheckStatus = async () => {
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

      setButtonText("Check Status");
      setButtonClass("");
    } catch (error) {
      setError('Failed to fetch data');
      setButtonText("Check Status");
      setButtonClass("");
    }
  };

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
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
            <div><strong>Fire Ban:</strong> {fireBan.status || "Information not available."}</div>
            <div><strong>Municipality:</strong> {fireBan.county || "Information not available."}</div>
          </div>
        )}
        {fireHazard && (
          <div>
            <button onClick={toggleMoreInfo} className="check-button">
              {showMoreInfo ? "Hide Information" : "More Information"}
            </button>
            {showMoreInfo && (
              <div className="result-box">
                <div className="collapsible-header" onClick={toggleMoreInfo}>
                  <strong>Detailed Information</strong>
                  <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
                </div>
                {showMoreInfo && (
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
          </div>
        )}
      </main>
    </div>
  );
};

export default FireBanChecker;