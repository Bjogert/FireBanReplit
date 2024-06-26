import React from 'react';
import FireBanChecker from './components/FireBanChecker';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img className="logo" src="/FireBanChecker_Logo.jpg" alt="Fire Ban Checker Logo" />
      </header>
      <FireBanChecker />
    </div>
  );
}

export default App;
