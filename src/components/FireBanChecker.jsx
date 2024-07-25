import React, { useState, useEffect } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';
import { getCurrentPosition } from '../services/geolocationService';
import { getCoordinates } from '../services/municipalityService';
import FireHazardScale from './FireHazardScale';
import Autocomplete from './Autocomplete';
import WeeklyForecast from './WeeklyForecast';
import FireHazardInfoBox from './FireHazardInfoBox'; // Import the new component
import '../App.css';

const FireBanChecker = () => {
  const [error, setError] = useState(null);
  const [fireHazard, setFireHazard] = useState(null);
  const [fireBan, setFireBan] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [municipality, setMunicipality] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [showMunicipalityForm, setShowMunicipalityForm] = useState(false);
  const [collapseContent, setCollapseContent] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { coords } = await getCurrentPosition();
        const { latitude, longitude } = coords;
        setLatitude(latitude);
        setLongitude(longitude);
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
    setError(null);
    setFireHazard(null);
    setFireBan(null);

    try {
      const fireBanData = await fetchFireBanData(latitude, longitude);
      const fireProhibitionData = await fetchFireProhibitionData(latitude, longitude);
      setFireHazard(fireBanData);
      setFireBan(fireProhibitionData);
      setDetailsVisible(true);
      setDataFetched(true);
      setShowMunicipalityForm(false);
    } catch (error) {
      setError('Failed to fetch data');
    }
  };

  const handleMunicipalitySelect = async (selectedMunicipality) => {
    setMunicipality(selectedMunicipality);
    try {
      const { latitude, longitude } = await getCoordinates(selectedMunicipality);
      setLatitude(latitude);
      setLongitude(longitude);
      fetchDataWithCoordinates(latitude, longitude);
    } catch (error) {
      setError('Failed to fetch data for the selected municipality');
    }
  };

  const handleGetLocation = async () => {
    try {
      const { coords } = await getCurrentPosition();
      const { latitude, longitude } = coords;
      setLatitude(latitude);
      setLongitude(longitude);
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
        {latitude && longitude && (
          <div className="weekly-forecast-container">
            <WeeklyForecast latitude={latitude} longitude={longitude} />
          </div>
        )}
        {fireHazard && (
          <div className="fire-hazard-scale-container">
            <FireHazardScale level={fireHazard.riskIndex} />
            <div className="detailed-info-text-box">
              {fireHazard.riskMessage || "Information not available."}
              <div className="last-updated">
                Giltig: <span dangerouslySetInnerHTML={{ __html: fireHazard.periodEndDate ? formatFireHazardValidityPeriod(fireHazard.periodEndDate) : "Information not available." }} /> <span className="source">Källa: MSB</span>
              </div>
            </div>
            <FireHazardInfoBox fireHazard={fireHazard} /> {/* Use the new component */}
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
          </>
        )}
        <div className="image-container">
          <img
            src="/fire.webp"
            alt="Fire image"
            className="fire-image"
          />
        </div>
      </main>
      <footer className="footer">
        <p>Plats för reklam.</p>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5691029239139782" crossOrigin="anonymous"></script>
      </footer>
    </div>
  );
};

export default FireBanChecker;