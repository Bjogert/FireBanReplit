import React, { useState, useEffect } from 'react';
import { fetchWeeklyForecastData } from '../services/fireBanService';
import '../WeeklyForecast.css';

const levels = [
  { label: 'Ingen data', className: 'wf-grey' },
  { label: 'Minimal risk', className: 'wf-blue' },
  { label: 'Låg risk', className: 'wf-green' },
  { label: 'Måttlig risk', className: 'wf-yellow' },
  { label: 'Hög risk', className: 'wf-orange' },
  { label: 'Mycket hög risk', className: 'wf-red' },
  { label: 'Extrem risk', className: 'wf-darkred' },
];

const WeeklyForecast = ({ latitude, longitude }) => {
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [error, setError] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching weekly forecast data for coordinates: ${latitude}, ${longitude}`);
        const data = await fetchWeeklyForecastData(latitude, longitude);
        console.log('Processed weekly forecast data:', JSON.stringify(data, null, 2)); // Log the processed data

        if (Array.isArray(data) && data.length > 0) {
          setWeeklyForecast(data);
        } else {
          setError('No weekly forecast data available');
        }
      } catch (error) {
        console.error('Error fetching weekly forecast data:', error);
        setError('Failed to fetch weekly forecast data');
      }
    };

    if (latitude && longitude) {
      fetchData();
    } else {
      setError('Invalid coordinates');
    }
  }, [latitude, longitude]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!weeklyForecast) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wf-collapsible-box">
      <div className="wf-collapsible-header" onClick={() => setShowMoreInfo(!showMoreInfo)}>
        <strong>Veckans Prognås</strong>
      </div>
      {showMoreInfo && (
        <div className="wf-collapsible-content show">
          <ul>
            {weeklyForecast.map((forecast, index) => {
              const level = levels[forecast.riskIndex] || levels[0];
              return (
                <li key={index} className={`wf-forecast-item ${level.className}`}>
                  {forecast.date} - {level.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeeklyForecast;


