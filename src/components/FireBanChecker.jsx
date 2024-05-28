// src/components/FireBanChecker.jsx
import React, { useState } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Får jag elda nu?");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);

  const handleCheckStatus = async () => {
    setButtonText("Checking...");
    setButtonClass("");
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const fireBanData = await fetchFireBanData(latitude.toFixed(4), longitude.toFixed(4));
          const fireProhibitionData = await fetchFireProhibitionData(latitude.toFixed(4), longitude.toFixed(4));

          if (fireProhibitionData.statusCode === 3) {
            setButtonText("Fire Ban in Place");
            setButtonClass("red");
          } else if (fireBanData.riskIndex >= 2) {
            setButtonText("Fire Risk Present");
            setButtonClass("yellow");
          } else {
            setButtonText("Safe to Light a Fire");
            setButtonClass("green");
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data');
          setButtonText("Får jag elda nu?");
        }
      }, (error) => {
        console.error('Error getting location:', error);
        setError('Failed to get location. Please try again.');
        setButtonText("Får jag elda nu?");
      });
    } else {
      setError('Geolocation is not supported by this browser.');
      setButtonText("Får jag elda nu?");
    }
  };

  return (
    <div>
      <nav className="menu-bar">
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
        {error && <div className="result" style={{ color: 'red' }}>{error}</div>}
      </main>
    </div>
  );
};

export default FireBanChecker;