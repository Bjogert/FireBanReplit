// src/components/FireBanChecker.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FireBanChecker from './FireBanChecker';

// Mock the services used in FireBanChecker
jest.mock('../services/fireBanService', () => ({
  fetchFireBanData: jest.fn(),
  fetchFireProhibitionData: jest.fn(),
}));

jest.mock('../services/geolocationService', () => ({
  getCurrentPosition: jest.fn(),
}));

jest.mock('../services/municipalityService', () => ({
  getCoordinates: jest.fn(),
}));

describe('FireBanChecker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the header component', () => {
    render(<FireBanChecker />);
    const headerElement = screen.getByText(/Får du elda nu?/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the fire hazard scale', () => {
    render(<FireBanChecker />);
    const lowElement = screen.getByText(/Low/i);
    const extremeElement = screen.getByText(/Extreme/i);
    expect(lowElement).toBeInTheDocument();
    expect(extremeElement).toBeInTheDocument();
  });

  test('renders the geolocation form', () => {
    render(<FireBanChecker />);
    const inputElement = screen.getByPlaceholderText(/Enter municipality/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('fetches data when form is submitted', async () => {
    const { fetchFireBanData, fetchFireProhibitionData } = require('../services/fireBanService');
    fetchFireBanData.mockResolvedValueOnce({ level: 'High' });
    fetchFireProhibitionData.mockResolvedValueOnce({ status: 'Banned', revisionDate: '2021-12-01' });

    render(<FireBanChecker />);

    const inputElement = screen.getByPlaceholderText(/Enter municipality/i);
    fireEvent.change(inputElement, { target: { value: 'Stockholm' } });

    const buttonElement = screen.getByText(/Submit/i);
    fireEvent.click(buttonElement);

    expect(fetchFireBanData).toHaveBeenCalled();
    expect(fetchFireProhibitionData).toHaveBeenCalled();
  });

  test('displays fetched data correctly', async () => {
    const { fetchFireBanData, fetchFireProhibitionData } = require('../services/fireBanService');
    fetchFireBanData.mockResolvedValueOnce({ level: 'High' });
    fetchFireProhibitionData.mockResolvedValueOnce({ status: 'Banned', revisionDate: '2021-12-01' });

    render(<FireBanChecker />);

    const inputElement = screen.getByPlaceholderText(/Enter municipality/i);
    fireEvent.change(inputElement, { target: { value: 'Stockholm' } });

    const buttonElement = screen.getByText(/Submit/i);
    fireEvent.click(buttonElement);

    const fireHazardLevel = await screen.findByText(/High/i);
    const fireBanStatus = await screen.findByText(/Banned/i);

    expect(fireHazardLevel).toBeInTheDocument();
    expect(fireBanStatus).toBeInTheDocument();
  });
});
