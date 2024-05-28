// src/components/FireBanChecker.jsx
import React, { useState } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Får jag elda nu?");
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

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const fireBanData = await fetchFireBanData(latitude.toFixed(4), longitude.toFixed(4));
          const fireProhibitionData = await fetchFireProhibitionData(latitude.toFixed(4), longitude.toFixed(4));

          if (fireProhibitionData.statusCode === 3) {
            setButtonText("Fire Ban in Place");
            setButtonClass("red");
            setFireBan("Fire ban in your location.");
          } else {
            setFireBan("No fire ban in your location.");
          }

          if (fireBanData.riskIndex >= 2) {
            setButtonText("Fire Risk Present");
            setButtonClass("yellow");
            setFireHazard({
              grass: fireBanData.grassMessage,
              wood: fireBanData.woodMessage,
              combustible: fireBanData.combustibleMessage,
              general: fireBanData.riskMessage
            });
          } else {
            setButtonText("Safe to Light a Fire");
            setButtonClass("green");
            setFireHazard({ general: "No fire hazard" });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data');
          setButtonText("Får jag elda nu?");
        } finally {
          setButtonClass("");
        }
      }, (error) => {
        console.error('Error getting location:', error);
        setError('Failed to get location. Please try again.');
        setButtonText("Får jag elda nu?");
        setButtonClass("");
      });
    } else {
      setError('Geolocation is not supported by this browser.');
      setButtonText("Får jag elda nu?");
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
            {fireHazard.general !== "No fire hazard" && (
              <ul>
                {fireHazard.grass && <li>Grass: {fireHazard.grass}</li>}
                {fireHazard.wood && <li>Wood: {fireHazard.wood}</li>}
                {fireHazard.combustible && <li>Combustible: {fireHazard.combustible}</li>}
                <li>General: {fireHazard.general}</li>
              </ul>
            )}
            {fireHazard.general === "No fire hazard" && (
              <div>No fire hazard</div>
            )}
          </div>
        )}
        {fireBan && (
          <div className="result">
            <div><strong>Fire Ban:</strong></div>
            <div>{fireBan}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FireBanChecker;