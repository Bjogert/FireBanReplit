import React, { useState } from 'react';
import municipalities from '../municipalities.json';

const Autocomplete = ({ onMunicipalitySelect }) => {
  const [municipality, setMunicipality] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onMunicipalityChange = (e) => {
    const value = e.target.value;
    setMunicipality(value);
    if (value.length > 0) {
      const filteredSuggestions = municipalities.filter(municipality =>
        municipality.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const onSuggestionClick = (suggestion) => {
    setMunicipality(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    onMunicipalitySelect(suggestion);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) { // Enter key
      e.preventDefault();
      setMunicipality(suggestions[activeSuggestionIndex]);
      setShowSuggestions(false);
      onMunicipalitySelect(suggestions[activeSuggestionIndex]);
    } else if (e.keyCode === 38) { // Up arrow
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.keyCode === 40) { // Down arrow
      if (activeSuggestionIndex + 1 === suggestions.length) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={municipality}
        onChange={onMunicipalityChange}
        onKeyDown={onKeyDown}
        placeholder="Välj Kommun"
        required
      />
      {showSuggestions && municipality && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => {
            let className;
            if (index === activeSuggestionIndex) {
              className = "suggestion-active";
            }
            return (
              <li className={className} key={suggestion} onClick={() => onSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;