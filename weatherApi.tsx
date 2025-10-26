import axios from 'axios';

const API_KEY = '732336031ded4f89b2a185316252510'; // Replace with your actual key
const BASE_URL = 'https://api.weatherapi.com/v1';

export const getCoordinates = async (city) => {
  try {
    const res = await axios.get(`${BASE_URL}/current.json`, {
      params: { key: API_KEY, q: city },
    });

    return {
      lat: res.data.location.lat,
      lon: res.data.location.lon,
      name: res.data.location.name,
      region: res.data.location.region,
      country: res.data.location.country,
    };
  } catch (err) {
    console.error(
      '❌ Error fetching coordinates:',
      err.response ? err.response.data : err.message
    );
    return null;
  }
};

export const getForecast = async (lat, lon) => {
  try {
    const res = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 7,
        aqi: 'no',
        alerts: 'no',
      },
    });
    return res.data;
  } catch (err) {
    console.error(
      '❌ Error fetching forecast:',
      err.response ? err.response.data : err.message
    );
    return null;
  }
};
