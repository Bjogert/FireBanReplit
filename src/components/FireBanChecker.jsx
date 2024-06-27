import React, { useState } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import FireHazardScale from './FireHazardScale';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Hämta Info");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [buttonCollapsed, setButtonCollapsed] = useState(false);

  const handleCheckStatus = async () => {
    if (buttonText === "Hämta Info") {
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

        setButtonText("Mer Information");
        setButtonClass("");
      } catch (error) {
        setError('Failed to fetch data');
        setButtonText("Hämta Info");
        setButtonClass("");
      }
    } else {
      setButtonCollapsed(true);
      setTimeout(() => {
        setDetailsVisible(true);
        setShowMoreInfo(true);
      }, 500);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Information not available.";
    return dateTimeString.replace("T", " - ");
  };

  return (
    <div>
      <main className="main">
        {fireHazard && (
          <div className="fire-hazard-scale-container">
            <FireHazardScale level={fireHazard.fwiIndex} />
            <div className="detailed-info-text-box">
              {fireHazard.fwiMessage || "Information not available."}
              <div className="last-updated">
                Uppdaterad: {formatDateTime(fireHazard.periodEndDate)}
              </div>
            </div>
          </div>
        )}
        {!buttonCollapsed && (
          <button 
            id="check-button" 
            className={`check-button ${buttonClass} ${buttonCollapsed ? 'collapse' : ''}`} 
            onClick={handleCheckStatus}
          >
            {buttonText}
          </button>
        )}
        {error && <div className="result error-message">{error}</div>}
        {fireBan && (
          <div className="result-box">
            <div className="status-box">
              <strong>Det råder:</strong> {fireBan.status || "Information not available."}
            </div>
            <div className="municipality-box">
              <strong>Kommun:</strong> {fireBan.county || "Information not available."}
            </div>
            <div className="last-updated">
              Uppdaterad: {formatDateTime(fireBan.revisionDate)}
            </div>
          </div>
        )}
        {detailsVisible && (
          <div className="result-box detailed-info-box">
            <div className="collapsible-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
              <strong>Detailed Information</strong>
              <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
            </div>
            {showMoreInfo && fireHazard && (
              <div className="collapsible-content show">
                <ul>
                  <li><strong>Aktuellt Läge:</strong> {fireHazard.fwiMessage || "Information not available."}</li>
                  <li><strong>Brandsäkerhet:</strong> {fireHazard.combustibleMessage || "Information not available."}</li>
                  <li><strong>Brandrisk Gräs:</strong> {fireHazard.grassMessage || "Information not available."}</li>
                  <li><strong>I Skog & Mark:</strong> {fireHazard.woodMessage || "Information not available."}</li>
                  <li><strong>Generellt:</strong> {fireHazard.riskMessage || "Information not available."}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
      <div className="image-container">
        <img src="/FireBanReplit/fire.jpg" alt="Fire image" className="fire-image" />
      </div>
    </div>
  );
};

export default FireBanChecker;