// src/App.jsx
import React from 'react';
import FireBanChecker from './components/FireBanChecker';
import './App.css';
import './global.css';
import './header.css';

function App() {
  return (
    <div className="App">
      <FireBanChecker />
    </div>
  );
}

export default App;