const proxyUrl = 'https://wiesel.repl.co/api';

export const fetchFireBanData = async (latitude, longitude) => {
    const url = `${proxyUrl}/brandrisk/v2/CurrentRisk/sv/${latitude}/${longitude}`;
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
        console.log('Data received:', data);

        return data;

    } catch (error) {
        console.error("Error fetching fire ban data:", error.message);
        return { status: "Failed to fetch data" };
    }
};

export const fetchFireProhibitionData = async (latitude, longitude) => {
    const url = `${proxyUrl}/brandrisk/v2/FireProhibition/sv/${latitude}/${longitude}`;
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
        console.log('Data received:', data);

        return data;

    } catch (error) {
        console.error("Error fetching fire prohibition data:", error.message);
        return { status: "Failed to fetch data" };
    }
};