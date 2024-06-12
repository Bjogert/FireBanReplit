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

  const handleCheckStatus = async () => {
    setButtonText("Checking...");
    setButtonClass("loading");
    setError(null);
    setFireHazard(null);
    setFireBan(null);

    try {
      console.log("Fetching fire ban data...");
      const fireBanData = await fetchFireBanData();
      console.log("Fire ban data received:", fireBanData);

      console.log("Fetching fire prohibition data...");
      const fireProhibitionData = await fetchFireProhibitionData();
      console.log("Fire prohibition data received:", fireProhibitionData);

      setFireHazard(fireBanData);
      setFireBan(fireProhibitionData);

      setButtonText("Check Status");
      setButtonClass("");
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setButtonText("Check Status");
      setButtonClass("");
    }
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
        {fireHazard && (
          <div className="result">
            <div><strong>Fire Hazard:</strong></div>
            <ul>
              <li>FWI Message: {fireHazard.forecast?.fwiMessage}</li>
              <li>Combustible Message: {fireHazard.forecast?.combustibleMessage}</li>
              <li>Grass Message: {fireHazard.forecast?.grassMessage}</li>
              <li>Wood Message: {fireHazard.forecast?.woodMessage}</li>
              <li>General Risk Message: {fireHazard.forecast?.riskMessage}</li>
            </ul>
          </div>
        )}
        {fireBan && (
          <div className="result">
            <div><strong>Fire Ban:</strong></div>
            <div>{fireBan.fireProhibition ? fireBan.fireProhibition : "No fire ban in your location."}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FireBanChecker;