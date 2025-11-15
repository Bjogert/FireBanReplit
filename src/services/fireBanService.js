// src/services/fireBanService.js

// Configuration for API access
const MSB_API_BASE = 'https://api.msb.se/brandrisk/v2';
const USE_PROXY = false; // Set to true if direct access fails
const PROXY_URL = 'https://thingproxy-oxuk.onrender.com/fetch/';

/**
 * Fetches data from MSB API with optional proxy fallback
 * @param {string} url - The target URL to fetch
 * @returns {Promise<Response>} - Fetch response
 */
const fetchWithOptionalProxy = async (url) => {
    const targetUrl = USE_PROXY ? PROXY_URL + url : url;
    
    return fetch(targetUrl, {
        headers: {
            'Accept': 'application/json'
        }
    });
};

export const fetchFireBanData = async (latitude, longitude) => {
    const targetUrl = `${MSB_API_BASE}/CurrentRisk/sv/${latitude}/${longitude}`;
    console.log(`Fetching fire ban data for coordinates: ${latitude}, ${longitude}`);

    try {
        const response = await fetchWithOptionalProxy(targetUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            return { status: "No fire ban information available for this location." };
        }

        const { forecast, periodEndDate } = data;
        const {
            date,
            fwiIndex,
            fwiMessage,
            combustibleIndex,
            combustibleMessage,
            grassIndex,
            grassMessage,
            woodIndex,
            woodMessage,
            riskIndex,
            riskMessage
        } = forecast;

        return {
            date,
            periodEndDate,
            fwiIndex,
            fwiMessage,
            combustibleIndex,
            combustibleMessage,
            grassIndex,
            grassMessage,
            woodIndex,
            woodMessage,
            riskIndex,
            riskMessage,
            status: riskMessage || "No specific fire risk message available."
        };

    } catch (error) {
        console.error("Error fetching fire ban data:", error);
        throw new Error(`Failed to fetch fire ban data: ${error.message}`);
    }
};



export const fetchFireProhibitionData = async (latitude, longitude) => {
    const targetUrl = `${MSB_API_BASE}/FireProhibition/sv/${latitude}/${longitude}`;
    console.log(`Fetching fire prohibition data for coordinates: ${latitude}, ${longitude}`);

    try {
        const response = await fetchWithOptionalProxy(targetUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            return { status: "No fire prohibition information available for this location." };
        }

        const { county, countyCode, municipality, municipalityCode, fireProhibition } = data;
        const { status, statusMessage, statusCode, startDate, revisionDate, description, authority, url: authorityUrl } = fireProhibition;

        return {
            county,
            countyCode,
            municipality,
            municipalityCode,
            status,
            statusMessage,
            statusCode,
            startDate: startDate ? new Date(startDate).toLocaleString() : "N/A",
            revisionDate: revisionDate ? new Date(revisionDate).toLocaleString() : "N/A",
            description,
            authority,
            authorityUrl,
        };

    } catch (error) {
        console.error("Error fetching fire prohibition data:", error);
        throw new Error(`Failed to fetch fire prohibition data: ${error.message}`);
    }
};



export const fetchWeeklyForecastData = async (latitude, longitude) => {
    const targetUrl = `${MSB_API_BASE}/RiskPartOfDayForecast/sv/${latitude}/${longitude}`;
    console.log(`Fetching weekly forecast data for coordinates: ${latitude}, ${longitude}`);

    try {
        const response = await fetchWithOptionalProxy(targetUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const processedData = data.reduce((acc, item) => {
            const date = new Date(item.forecast.date).toLocaleDateString('sv-SE', {
                weekday: 'short',
                day: 'numeric',
                month: 'numeric'
            });

            // Capitalize the first letter of the weekday
            const capitalizedDate = date.charAt(0).toUpperCase() + date.slice(1);

            if (!acc[capitalizedDate]) {
                acc[capitalizedDate] = {
                    fwiIndices: [],
                    combustibleIndices: [],
                    grassIndices: [],
                    woodIndices: [],
                    riskIndices: [],
                };
            }

            acc[capitalizedDate].fwiIndices.push(item.forecast.fwiIndex);
            acc[capitalizedDate].combustibleIndices.push(item.forecast.combustibleIndex);
            acc[capitalizedDate].grassIndices.push(item.forecast.grassIndex);
            acc[capitalizedDate].woodIndices.push(item.forecast.woodIndex);
            acc[capitalizedDate].riskIndices.push(item.forecast.riskIndex);

            return acc;
        }, {});

        const average = (arr) => {
            const validValues = arr.filter(v => v !== -1);
            return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
        };

        const organizedData = Object.keys(processedData).map(date => {
            const fwiIndex = Math.round(average(processedData[date].fwiIndices));
            const combustibleIndex = Math.round(average(processedData[date].combustibleIndices));
            const grassIndex = Math.round(average(processedData[date].grassIndices.filter(v => v !== -1)));
            const woodIndex = Math.round(average(processedData[date].woodIndices));
            const riskIndex = Math.round(average(processedData[date].riskIndices));

            const indices = [fwiIndex, combustibleIndex, grassIndex, woodIndex, riskIndex].filter(v => !isNaN(v));
            const masterCombustibleIndex = Math.round(average(indices));

            return {
                date,
                masterCombustibleIndex
            };
        });

        console.log('Processed forecast data:', organizedData);
        return organizedData;
    } catch (error) {
        console.error("Error fetching weekly forecast data:", error);
        throw new Error(`Failed to fetch weekly forecast data: ${error.message}`);
    }
};