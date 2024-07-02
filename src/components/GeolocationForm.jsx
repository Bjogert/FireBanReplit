// src/components/GeolocationForm.jsx
import React, { useState, useEffect } from 'react';
import { getCurrentPosition } from '../services/geolocationService';
import { getCoordinates } from '../services/municipalityService';

const GeolocationForm = ({ setButtonText, setButtonClass, setError, setFireHazard, setFireBan, setDataFetched, useGeolocation, setUseGeolocation }) => {
  const [municipality, setMunicipality] = useState("");
  const [showMunicipalityForm, setShowMunicipalityForm] = useState(false);

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
      setDataFetched(true);
      setButtonText("Hämta Info");
      setButtonClass("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
      setButtonText("Försök igen");
      setButtonClass("Error");
    }
  };

  return (
    <div>
      {/* Add form elements for geolocation and municipality input */}
    </div>
  );
};

export default GeolocationForm;
