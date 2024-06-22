import React, { useState } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Check Status");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

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

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <nav className="menu-bar">
        <div className="logo">Fire Ban Checker</div>
        <ul>
          <li><a href="#language">Language</a></li>
          <li><a href="#allemansratt">Allemansrätt</a></li>
          <li><a href="#fire-safety">Fire Safety Tips</a></li>
        </ul>
      </nav>
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
            <div><strong>Fire Ban:</strong> {fireBan.status || "No fire ban in your location."}</div>
            <div><strong>Municipality:</strong> {fireBan.county}</div>
          </div>
        )}
        {fireHazard && (
          <div>
            {['FWI Message', 'Combustible Message', 'Grass Message', 'Wood Message', 'General Risk Message'].map((message, index) => (
              <div key={index} className="result-box">
                <div onClick={() => toggleIndex(index)} className="collapsible-header">
                  <strong>{message}</strong>
                </div>
                {activeIndex === index && (
                  <div className="collapsible-content">
                    <ul>
                      {message === 'FWI Message' && <li>{fireHazard.fwiMessage}</li>}
                      {message === 'Combustible Message' && <li>{fireHazard.combustibleMessage}</li>}
                      {message === 'Grass Message' && <li>{fireHazard.grassMessage}</li>}
                      {message === 'Wood Message' && <li>{fireHazard.woodMessage}</li>}
                      {message === 'General Risk Message' && <li>{fireHazard.riskMessage}</li>}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FireBanChecker;