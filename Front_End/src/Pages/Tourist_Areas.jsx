import React, { useState } from 'react';
import image1 from '../Pictures/Namo_Buddha.jpg';
import image2 from '../Pictures/Chitwan.jpg';
import image3 from '../Pictures/Chitwan.jpg';
import image4 from '../Pictures/Chitwan.jpg';

const images = [image1, image2, image3, image4];

function Tourist_Areas() {
  const [currentIndex] = useState(0); 

  return (
    <div className="relative w-full h-full overflow-hidden"> {/* Added overflow-hidden */}
      <img
        src={images[currentIndex]} 
        alt={`Tourist Area ${currentIndex + 1}`}
        className="w-full h-full max-w-full max-h-full object-contain" // Ensures the image is constrained within the container
      />
    </div>
  );
}

export default Tourist_Areas;
