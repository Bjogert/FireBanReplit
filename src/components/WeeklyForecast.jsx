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

  const calculateAverageHazard = (data) => {
    if (data.length < 3) {
      throw new Error("Insufficient data to calculate average hazard");
    }

    const calculateAverage = (key) => {
      return data.slice(0, 3).reduce((sum, day) => sum + day[key], 0) / 3;
    };

    const averageRiskIndex = calculateAverage('riskIndex');

    const additionalDays = [];
    for (let i = 1; i <= 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      additionalDays.push({
        date: date.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'numeric' }),
        riskIndex: averageRiskIndex,
        riskMessage: 'Average calculated risk'
      });
    }

    const combinedData = data.concat(additionalDays);

    const uniqueDates = Array.from(new Set(combinedData.map(item => item.date)));

    return uniqueDates.map(date => {
      const dayData = combinedData.filter(item => item.date === date);
      const avgRiskIndex = dayData.reduce((sum, item) => sum + item.riskIndex, 0) / dayData.length;
      return {
        date,
        riskIndex: Math.round(avgRiskIndex),
        riskMessage: levels[Math.round(avgRiskIndex)]?.label || 'Ingen data'
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeeklyForecastData(latitude, longitude);
        const completeData = calculateAverageHazard(data);
        setWeeklyForecast(completeData);
      } catch (error) {
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
      <div className="wf-collapsible-header">
        <strong>Veckans Prognås</strong>
      </div>
      <div className="wf-collapsible-content show">
        <ul>
          {weeklyForecast.map((day, index) => (
            <li key={index} className={levels[day.riskIndex]?.className || 'wf-grey'}>
              <span>
                {day.date}: {day.riskMessage}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeeklyForecast;
