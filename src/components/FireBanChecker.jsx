import React, { useState, useEffect } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import { getCurrentPosition } from '../services/geolocationService';
import { getCoordinates } from '../services/municipalityService';
import FireHazardScale from './FireHazardScale';
import Autocomplete from './Autocomplete';
import '../App.css';

const FireBanChecker = () => {
  const [buttonText, setButtonText] = useState("Hämta Info");
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false); 
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [municipality, setMunicipality] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [showMunicipalityForm, setShowMunicipalityForm] = useState(false);
  const [collapseContent, setCollapseContent] = useState(false);

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
      setButtonText("Hämta Info");
      setButtonClass("");
      setDetailsVisible(true);
      setShowMoreInfo(false);
      setDataFetched(true);
      setShowMunicipalityForm(false);
    } catch (error) {
      setError('Failed to fetch data');
      setButtonText("Hämta Info");
      setButtonClass("");
    }
  };

  const handleMunicipalitySelect = async (selectedMunicipality) => {
    setMunicipality(selectedMunicipality);
    try {
      const { latitude, longitude } = await getCoordinates(selectedMunicipality);
      fetchDataWithCoordinates(latitude, longitude);
    } catch (error) {
      setError('Failed to fetch data for the selected municipality');
    }
  };

  const handleGetLocation = async () => {
    try {
      const { coords } = await getCurrentPosition();
      const { latitude, longitude } = coords;
      fetchDataWithCoordinates(latitude, longitude);
    } catch (error) {
      console.error("Geolocation error:", error);
      setError("Failed to fetch location");
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
        <div className="form-container">
          {!useGeolocation && !dataFetched && !showMunicipalityForm && (
            <form>
              <Autocomplete onMunicipalitySelect={handleMunicipalitySelect} onGetLocation={handleGetLocation} />
            </form>
          )}
          {showMunicipalityForm && (
            <form>
              <Autocomplete onMunicipalitySelect={handleMunicipalitySelect} onGetLocation={handleGetLocation} />
            </form>
          )}
        </div>
        {fireHazard && (
          <div className="fire-hazard-scale-container">
            <FireHazardScale level={fireHazard.riskIndex} />
            <div className="detailed-info-text-box">
              {fireHazard.riskMessage || "Information not available."}
              <div className="last-updated">
                Giltig: <span dangerouslySetInnerHTML={{ __html: fireHazard.periodEndDate ? formatFireHazardValidityPeriod(fireHazard.periodEndDate) : "Information not available." }} /> <span className="source">Källa: MSB</span>
              </div>
            </div>
          </div>
        )}
        {!collapseContent && (
          <>
            {error && <div className="result error-message">{error}</div>}
            {fireBan && (
              <div className="result-box">
                <div className="status-box">
                  <span>Det råder:</span> {fireBan.status || "Information not available."}
                </div>
                <div className="municipality-box">
                  <span>Kommun:</span> {fireBan.county || "Information not available."}
                </div>
                <div className="last-updated">
                  Uppdaterad: <span dangerouslySetInnerHTML={{ __html: fireBan.revisionDate ? formatFireBanUpdateDate(fireBan.revisionDate) : "Information not available." }} /> <span className="source">Källa: MSB</span>
                </div>
              </div>
            )}
            {detailsVisible && fireHazard && (
              <div className="result-box detailed-info-box">
                <div className="collapsible-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
                  <i className={`fas fa-chevron-${showMoreInfo ? 'up' : 'down'}`}></i>
                  <strong>Mer Information</strong>
                </div>
                {showMoreInfo && (
                  <div className="collapsible-content show">
                    <ul>
                      <li><strong>Aktuellt Läge:</strong> {fireHazard.fwiMessage || "Information not available."}</li>
                      <li><strong>Brandsäkerhet:</strong> {fireHazard.combustibleMessage || "Information not available."}</li>
                      <li><strong>I Skog & Mark:</strong> {fireHazard.woodMessage || "Information not available."}</li>
                      <li><strong> Brandrisk Gräs: </strong> 
{fireHazard.grassMessage ||         "Information not available."}</li>
                      <li><strong>Generellt:</strong> {fireHazard.riskMessage || "Information not available."}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        <div className="image-container">
          <img
            src="/FireBanReplit/fire.webp"
            alt="Fire image"
            className="fire-image"
          />
        </div>
      </main>
    </div>
  );
};

export default FireBanChecker;