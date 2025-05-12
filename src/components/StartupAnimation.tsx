
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
        
        {/* Smile curve */}
        <div className="relative w-24 h-12 overflow-hidden">
          <div 
            className={`absolute w-24 h-24 border-4 rounded-full border-mood-primary transition-opacity duration-300 ${
              smileVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ top: '-15px' }}
          />
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
