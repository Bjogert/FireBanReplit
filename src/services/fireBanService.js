// src/services/fireBanService.js
const proxyUrl = 'https://thingproxy-oxuk.onrender.com/fetch/';

export const fetchFireBanData = async (latitude, longitude) => {
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
        console.error("Error fetching fire ban data:", error.message);
        return { status: "Failed to fetch data" };
    }
};



export const fetchFireProhibitionData = async (latitude, longitude) => {
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
        console.error("Error fetching fire prohibition data:", error.message);
        return { status: "Failed to fetch data" };
    }
};


export const fetchWeeklyForecastData = async (latitude, longitude) => {
    const targetUrl = `https://api.msb.se/brandrisk/v2/RiskPartOfDayForecast/sv/${latitude}/${longitude}`;
    const url = proxyUrl + targetUrl;
    console.log(`Fetching data from: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data, status code: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weekly forecast data received:', JSON.stringify(data, null, 2)); // Log the structured data

        // Extract only unique dates with their corresponding riskIndex
        const uniqueData = data.reduce((acc, forecast) => {
            const date = new Date(forecast.forecast.date).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'numeric' });
            if (!acc.some(f => f.date === date)) {
                acc.push({
                    date,
                    riskIndex: forecast.forecast.riskIndex
                });
            }
            return acc;
        }, []);

        console.log('Processed unique forecast data:', JSON.stringify(uniqueData, null, 2)); // Log the processed data
        return uniqueData;
    } catch (error) {
        console.error("Error fetching weekly forecast data:", error.message);
        throw error;
    }
};

