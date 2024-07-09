import React from 'react';
import FireBanChecker from './components/FireBanChecker';
import './App.css';
import './global.css';
import './header.css';
import './FireHazardScale.css';
import './WeeklyForecast.css';
import './AutoComplete.css';
import './FireHazardInfoBox.css'; // Ensure this new CSS file is imported

function App() {
  return (
    <div className="App">
      <FireBanChecker />
    </div>
  );
}

export default App;