// src/components/FireBanChecker.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FireBanChecker from './FireBanChecker';

describe('FireBanChecker', () => {
  test('renders the check status button', () => {
    render(<FireBanChecker />);
    const checkButton = screen.getByText(/check status/i);
    expect(checkButton).toBeInTheDocument();
  });

  test('toggles more information section', () => {
    render(<FireBanChecker />);
    const moreInfoButton = screen.getByText(/more information/i);

    // Initially, the "more information" section should be hidden
    expect(screen.queryByText(/FWI Message/i)).not.toBeInTheDocument();

    // Click the "more information" button to show the section
    fireEvent.click(moreInfoButton);
    expect(screen.getByText(/FWI Message/i)).toBeInTheDocument();

    // Click again to hide the section
    fireEvent.click(moreInfoButton);
    expect(screen.queryByText(/FWI Message/i)).not.toBeInTheDocument();
  });

  test('handles geolocation error', async () => {
    jest.spyOn(global.navigator.geolocation, 'getCurrentPosition').mockImplementation((success, error) => error());

    render(<FireBanChecker />);
    const checkButton = screen.getByText(/check status/i);
    fireEvent.click(checkButton);

    const errorMessage = await screen.findByText(/failed to fetch data/i);
    expect(errorMessage).toBeInTheDocument();
  });
});