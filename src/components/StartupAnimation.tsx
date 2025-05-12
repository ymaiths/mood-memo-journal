
import React, { useEffect, useState } from 'react';

const StartupAnimation: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [leftDotVisible, setLeftDotVisible] = useState(false);
  const [rightDotVisible, setRightDotVisible] = useState(false);
  const [smileVisible, setSmileVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  
  useEffect(() => {
    // Show elements in sequence
    const leftDotTimer = setTimeout(() => setLeftDotVisible(true), 300);
    const rightDotTimer = setTimeout(() => setRightDotVisible(true), 800);
    const smileTimer = setTimeout(() => setSmileVisible(true), 1300);
    const textTimer = setTimeout(() => setTextVisible(true), 1800);
    
    // Hide the animation after 3.5 seconds (extended to allow for the sequence)
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 3500);
    
    return () => {
      clearTimeout(leftDotTimer);
      clearTimeout(rightDotTimer);
      clearTimeout(smileTimer);
      clearTimeout(textTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative">
        {/* Left eye dot */}
        <div 
          className={`absolute -left-8 -top-6 w-4 h-4 bg-mood-primary rounded-full transition-opacity duration-300 ${
            leftDotVisible ? 'opacity-100 animate-pulse-gentle' : 'opacity-0'
          }`} 
        />
        
        {/* Right eye dot */}
        <div 
          className={`absolute left-8 -top-6 w-4 h-4 bg-mood-primary rounded-full transition-opacity duration-300 ${
            rightDotVisible ? 'opacity-100 animate-pulse-gentle' : 'opacity-0'
          }`}
        />
        
        {/* "U" shape instead of smile curve */}
        <div className="relative w-24 h-12">
          <div 
            className={`transition-opacity duration-300 ${
              smileVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute -left-4 top-0 w-4 h-12 border-l-4 border-b-4 border-mood-primary rounded-bl-full"></div>
            <div className="absolute w-16 h-4 border-b-4 border-mood-primary" style={{ left: '0px', top: '8px' }}></div>
            <div className="absolute left-16 top-0 w-4 h-12 border-r-4 border-b-4 border-mood-primary rounded-br-full"></div>
          </div>
        </div>
        
        {/* Branding text */}
        <div 
          className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xl font-medium text-mood-primary transition-opacity duration-500 ${
            textVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          บันทึกอารมณ์
        </div>
      </div>
    </div>
  );
};

export default StartupAnimation;
