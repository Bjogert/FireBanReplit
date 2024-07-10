import React, { useState, useEffect, useRef } from 'react';
import { fetchWeeklyForecastData } from '../services/fireBanService';
import '../WeeklyForecast.css';

const levels = {
  '-1': { label: 'Ingen data', className: 'wf-grey' },
  '1': { label: 'Minimal risk', className: 'wf-blue' },
  '2': { label: 'Låg risk', className: 'wf-green' },
  '3': { label: 'Måttlig risk', className: 'wf-yellow' },
  '4': { label: 'Hög risk', className: 'wf-orange' },
  '5': { label: 'Mycket hög risk', className: 'wf-red' },
  '6': { label: 'Extrem risk', className: 'wf-darkred' },
};

const WeeklyForecast = ({ latitude, longitude }) => {
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeeklyForecastData(latitude, longitude);
        setWeeklyForecast(data);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [boxRef]);

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!weeklyForecast) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={boxRef} className={`wf-collapsible-box ${isOpen ? 'open' : ''}`}>
      <div className="wf-collapsible-header" onClick={toggleBox}>
        <strong>Idag-Övermorgon</strong>
      </div>
      <div className={`wf-collapsible-content ${isOpen ? 'show' : ''}`}>
        <ul>
          {weeklyForecast.map((day, index) => (
            <li key={index} className={levels[day.masterCombustibleIndex]?.className || 'wf-grey'}>
              <span>
                {day.date}: {levels[day.masterCombustibleIndex]?.label || 'Ingen data'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeeklyForecast;