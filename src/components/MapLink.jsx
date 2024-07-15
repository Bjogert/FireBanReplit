// src/components/MapLink.jsx

import React from 'react';
import '../MapLink.css'; // Import the CSS file

const MapLink = () => {
  return (
    <div className="map-link"> {/* Apply CSS class */}
      <a href="https://msbgis.maps.arcgis.com/apps/webappviewer/index.html?id=34f08aa5a51d4a73b1a0692173022d53" target="_blank" rel="noopener noreferrer">
        <img
          src="./swedish_map_outline.png"
          alt="Swedish map"
          className="swedish-map-image" // Apply a CSS class for styling
        />
      </a>
    </div>
  );
};

export default MapLink;