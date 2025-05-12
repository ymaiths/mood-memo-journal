
import React, { useEffect, useState } from 'react';

const StartupAnimation: React.FC = () => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Hide the animation after 2.5 seconds
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative">
        {/* Left eye dot */}
        <div className="absolute -left-8 -top-6 w-4 h-4 bg-mood-primary rounded-full animate-pulse-gentle" />
        
        {/* Right eye dot */}
        <div className="absolute left-8 -top-6 w-4 h-4 bg-mood-primary rounded-full animate-pulse-gentle" />
        
        {/* Smile curve */}
        <div className="relative w-24 h-12 overflow-hidden">
          <div 
            className="absolute w-24 h-24 border-4 rounded-full border-mood-primary"
            style={{ top: '-15px' }}
          />
        </div>
        
        {/* Branding text */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xl font-medium text-mood-primary opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          บันทึกอารมณ์
        </div>
      </div>
    </div>
  );
};

export default StartupAnimation;
