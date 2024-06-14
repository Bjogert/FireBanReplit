import React, { useState, useEffect } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Check Status");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude.toFixed(2),
          longitude: position.coords.longitude.toFixed(2),
        });
      }, error => {
        console.error("Error fetching geolocation: ", error.message);
        setError('Failed to fetch geolocation');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleCheckStatus = async () => {
    setButtonText("Checking...");
    setButtonClass("loading");
    setError(null);
    setFireHazard(null);
    setFireBan(null);

    if (!location.latitude || !location.longitude) {
      setError('Geolocation is not available.');
      setButtonText("Check Status");
      setButtonClass("");
      return;
    }

    try {
      console.log("Fetching fire ban data...");
      const fireBanData = await fetchFireBanData(location.latitude, location.longitude);
      console.log("Fire ban data received:", fireBanData);

      console.log("Fetching fire prohibition data...");
      const fireProhibitionData = await fetchFireProhibitionData(location.latitude, location.longitude);
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
              <li>FWI Message: {fireHazard.fwiMessage}</li>
              <li>Combustible Message: {fireHazard.combustibleMessage}</li>
              <li>Grass Message: {fireHazard.grassMessage}</li>
              <li>Wood Message: {fireHazard.woodMessage}</li>
              <li>General Risk Message: {fireHazard.riskMessage}</li>
            </ul>
          </div>
        )}
        {fireBan && (
          <div className="result">
            <div><strong>Fire Ban:</strong></div>
            <div>{fireBan.statusMessage}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FireBanChecker;