import React, { useState } from 'react';
import { fetchFireBanData, fetchFireProhibitionData } from '../services/fireBanService';

const FireBanChecker = () => {
    const [fireBanStatus, setFireBanStatus] = useState(null);
    const [fireProhibitionStatus, setFireProhibitionStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckStatus = async () => {
        setLoading(true);
        setError(null);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const fireBanData = await fetchFireBanData(latitude.toFixed(4), longitude.toFixed(4));
                    const fireProhibitionData = await fetchFireProhibitionData(latitude.toFixed(4), longitude.toFixed(4));
                    setFireBanStatus(fireBanData);
                    setFireProhibitionStatus(fireProhibitionData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError('Failed to fetch data');
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error('Error getting location:', error);
                setError('Failed to get location. Using default location.');
                fetchDefaultLocationData();
                setLoading(false);
            });
        } else {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
        }
    };

    const fetchDefaultLocationData = async () => {
        const defaultLatitude = 56.4259;
        const defaultLongitude = 12.8627;
        try {
            const fireBanData = await fetchFireBanData(defaultLatitude.toFixed(4), defaultLongitude.toFixed(4));
            const fireProhibitionData = await fetchFireProhibitionData(defaultLatitude.toFixed(4), defaultLongitude.toFixed(4));
            setFireBanStatus(fireBanData);
            setFireProhibitionStatus(fireProhibitionData);
        } catch (error) {
            console.error('Error fetching default location data:', error);
            setError('Failed to fetch default location data');
        }
    };

    return (
        <div>
            <h1>Check Fire Ban Status</h1>
            <button onClick={handleCheckStatus} disabled={loading}>
                {loading ? 'Checking...' : 'Check Status'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {fireBanStatus && (
                <div>
                    <p>Fire Ban Status: {fireBanStatus.status}</p>
                    {fireBanStatus.date && <p>Date: {new Date(fireBanStatus.date).toLocaleString()}</p>}
                    {fireBanStatus.periodEndDate && <p>Period End Date: {new Date(fireBanStatus.periodEndDate).toLocaleString()}</p>}
                    <p>FWI Index: {fireBanStatus.fwiIndex || 'N/A'}</p>
                    <p>FWI Message: {fireBanStatus.fwiMessage || 'N/A'}</p>
                    <p>Combustible Index: {fireBanStatus.combustibleIndex || 'N/A'}</p>
                    <p>Combustible Message: {fireBanStatus.combustibleMessage || 'N/A'}</p>
                    <p>Grass Index: {fireBanStatus.grassIndex || 'N/A'}</p>
                    <p>Grass Message: {fireBanStatus.grassMessage || 'N/A'}</p>
                    <p>Wood Index: {fireBanStatus.woodIndex || 'N/A'}</p>
                    <p>Wood Message: {fireBanStatus.woodMessage || 'N/A'}</p>
                    <p>Risk Index: {fireBanStatus.riskIndex || 'N/A'}</p>
                    <p>Risk Message: {fireBanStatus.riskMessage || 'N/A'}</p>
                </div>
            )}
            {fireProhibitionStatus && (
                <div>
                    <p>Fire Prohibition Status: {fireProhibitionStatus.status}</p>
                    <p>Status Message: {fireProhibitionStatus.statusMessage}</p>
                    <p>Status Code: {fireProhibitionStatus.statusCode}</p>
                    <p>Start Date: {new Date(fireProhibitionStatus.startDate).toLocaleString()}</p>
                    <p>Revision Date: {new Date(fireProhibitionStatus.revisionDate).toLocaleString()}</p>
                    <p>Description: {fireProhibitionStatus.description}</p>
                    <p>Authority: {fireProhibitionStatus.authority}</p>
                    <p>URL: <a href={fireProhibitionStatus.url} target="_blank" rel="noopener noreferrer">{fireProhibitionStatus.url}</a></p>
                </div>
            )}
        </div>
    );
};

export default FireBanChecker;