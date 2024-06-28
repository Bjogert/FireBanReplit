// src/components/FireBanChecker.jsx
import React, { useState, useEffect } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import { getCurrentPosition } from '../services/geolocationService';
import { getCoordinates } from '../services/municipalityService';
import FireHazardScale from './FireHazardScale';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Hämta Info");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false); // Default to false to keep it closed
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [municipality, setMunicipality] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(true);
  const [dataFetched, setDataFetched] = useState(false); // New state to track data fetching
  const [showMunicipalityForm, setShowMunicipalityForm] = useState(false); // State to track form visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { coords } = await getCurrentPosition();
        const { latitude, longitude } = coords;
        fetchDataWithCoordinates(latitude, longitude);
      } catch (error) {
        console.error("Geolocation error:", error);
        setUseGeolocation(false);
      }
    };

    if (useGeolocation) {
      fetchData();
    }
  }, [useGeolocation]);

  const fetchDataWithCoordinates = async (latitude, longitude) => {
    setButtonText("Lugn och ro...");
    setButtonClass("Laddar");
    setError(null);
    setFireHazard(null);
    setFireBan(null);

    try {
      const fireBanData = await fetchFireBanData(latitude, longitude);
      const fireProhibitionData = await fetchFireProhibitionData(latitude, longitude);
      setFireHazard(fireBanData);
      setFireBan(fireProhibitionData);
      setButtonText("Hämta Info"); // Reset button text
      setButtonClass("");
      setDetailsVisible(true); // Ensure detailed info section is visible
      setShowMoreInfo(false); // Keep the collapsible box closed by default
      setDataFetched(true); // Mark data as fetched
      setShowMunicipalityForm(false); // Hide the form after fetching data
    } catch (error) {
      setError('Failed to fetch data');
      setButtonText("Hämta Info"); // Reset button text
      setButtonClass("");
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      const { latitude, longitude } = await getCoordinates(municipality);
      fetchDataWithCoordinates(latitude, longitude);
    } catch (error) {
      setError('Failed to fetch data for the given municipality');
    }
  };

  const formatFireHazardValidityPeriod = (dateTimeString) => {
    if (!dateTimeString) return "Information not available.";

    const date = new Date(dateTimeString);
    const hours = date.getHours();

    let period;
    if (hours === 0 || hours === 24) {
      period = "18:00-00:00";
    } else if (hours === 6) {
      period = "00:00-06:00";
    } else if (hours === 12) {
      period = "06:00-12:00";
    } else if (hours === 18) {
      period = "12:00-18:00";
    } else {
      return "Invalid update time";
    }

    return `Idag, kl. ${period}`;
  };

  const formatFireBanUpdateDate = (dateTimeString) => {
    if (!dateTimeString) return "Information not available.";

    const date = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return date.toLocaleDateString('sv-SE', options);
  };

  useEffect(() => {
    const changeMunicipalityButton = document.getElementById('change-municipality');
    if (changeMunicipalityButton) {
      changeMunicipalityButton.addEventListener('click', () => {
        setShowMunicipalityForm(true);
      });
    }
  }, []);

  return (
    <div>
      <main className="main">
        {fireHazard && (
          <div className="fire-hazard-scale-container">
            <FireHazardScale level={fireHazard.riskIndex} />
            <div className="detailed-info-text-box">
              {fireHazard.riskMessage || "Information not available."}
              <div className="last-updated">
                Giltig: {fireHazard.periodEndDate ? formatFireHazardValidityPeriod(fireHazard.periodEndDate) : "Information not available."}
              </div>
            </div>
          </div>
        )}
        {error && <div className="result error-message">{error}</div>}
        {!useGeolocation && !dataFetched && !showMunicipalityForm && ( // Hide form and button if data is fetched
          <form onSubmit={handleManualSubmit}>
            <input
              type="text"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              placeholder="Välj Kommun"
              required
            />
            <button type="submit" className="check-button">
              Hämta Info
            </button>
          </form>
        )}
        {showMunicipalityForm && ( // Show form if "Byt Kommun" is clicked
          <form onSubmit={handleManualSubmit}>
            <input
              type="text"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              placeholder="Välj Kommun"
              required
            />
            <button type="submit" className="check-button">
              Hämta Info
            </button>
          </form>
        )}
        {fireBan && (
          <div className="result-box">
            <div className="status-box">
              <strong>Det råder:</strong> {fireBan.status || "Information not available."}
            </div>
            <div className="municipality-box">
              <strong>Kommun:</strong> {fireBan.county || "Information not available."}
            </div>
            <div className="last-updated">
              Uppdaterad: {fireBan.revisionDate ? formatFireBanUpdateDate(fireBan.revisionDate) : "Information not available."}
            </div>
          </div>
        )}
        {detailsVisible && fireHazard && (
          <div className="result-box detailed-info-box">
            <div className="collapsible-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
              <strong>Detailed Information</strong>
              <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
            </div>
            {showMoreInfo && (
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
        <img src="/FireBanReplit/fire.webp" alt="Fire image" className="fire-image" />
      </div>
    </div>
  );
};

export default FireBanChecker;

