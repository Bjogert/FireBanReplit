// src/services/municipalityService.js

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export const getCoordinates = async (municipality) => {
  const url = `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(municipality)}&format=json&limit=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("No results found");
    }
    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};