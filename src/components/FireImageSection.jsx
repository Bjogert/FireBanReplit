import React from 'react';

const FireImageSection = ({ collapseContent, setCollapseContent }) => (
  <>
    <div className="image-container">
      <img
        src="/fire.webp"
        alt="Fire image"
        className="fire-image"
        onClick={() => setCollapseContent(!collapseContent)}
      />
    </div>
  </>
);

export default FireImageSection;