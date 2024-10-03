import React from 'react';
import backgroundImage from '../assets/background.jpeg'; // Full image with the pyramid background

const HomePage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img 
          src={backgroundImage} 
          alt="7 Wonders background" 
          className="w-full h-full object-cover filter blur-sm"
        />
      </div>
      
      {/* Unblurred logo area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-lg h-32 overflow-hidden">
          <img 
            src={backgroundImage}  // Optionally, use a separate 'logo' image here.
            alt="7 Wonders logo" 
            className="w-full object-cover object-center"
            style={{
              objectPosition: '50% 25%', // Adjust positioning for desktop
              transform: 'scale(2)',     // Increase scaling for desktop
            }}
          />
        </div>
      </div>
      
      {/* Start Game button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mt-32">
          <button className="px-8 py-4 bg-yellow-600 text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 transition duration-300 ease-in-out">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

