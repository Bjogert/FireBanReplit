// src/services/fireBanService.js
export const fetchFireBanData = async () => {
  const proxyUrl = 'https://cors-proxy-pi-eight.vercel.app/';
  const latitude = 57.6094; // Gotland latitude
  const longitude = 18.2948; // Gotland longitude
  const targetUrl = `https://api.msb.se/brandrisk/v2/CurrentRisk/sv/${latitude}/${longitude}`;
  const url = proxyUrl + targetUrl;
  console.log(`Fetching data from: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch data, status code: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received:', data);

    if (!data || Object.keys(data).length === 0) {
      return { status: "No fire ban information available for this location." };
    }

    return data;

  } catch (error) {
    console.error("Error fetching fire ban data:", error.message);
    return { status: "Failed to fetch data" };
  }
};

export const fetchFireProhibitionData = async () => {
  const proxyUrl = 'https://cors-proxy-pi-eight.vercel.app/';
  const latitude = 57.6094; // Gotland latitude
  const longitude = 18.2948; // Gotland longitude
  const targetUrl = `https://api.msb.se/brandrisk/v2/FireProhibition/sv/${latitude}/${longitude}`;
  const url = proxyUrl + targetUrl;
  console.log(`Fetching data from: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch data, status code: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received:', data);

    if (!data || Object.keys(data).length === 0) {
      return { status: "No fire prohibition information available for this location." };
    }

    return data;

  } catch (error) {
    console.error("Error fetching fire prohibition data:", error.message);
    return { status: "Failed to fetch data" };
  }
};