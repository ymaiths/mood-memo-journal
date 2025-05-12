
import React, { useState, useEffect } from 'react';

interface StartupAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

const StartupAnimation: React.FC<StartupAnimationProps> = ({ show, onComplete }) => {
  const [showM1, setShowM1] = useState(false);
  const [showO1, setShowO1] = useState(false);
  const [showO2, setShowO2] = useState(false);
  const [showD, setShowD] = useState(false);
  const [showM2, setShowM2] = useState(false);
  const [showE, setShowE] = useState(false);
  const [showM3, setShowM3] = useState(false);
  const [showO3, setShowO3] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showAnimation, setShowAnimation] = useState(show);

  useEffect(() => {
    setShowAnimation(show);
    
    if (!show) {
      // Reset states when hidden
      setShowM1(false);
      setShowO1(false);
      setShowO2(false);
      setShowD(false);
      setShowM2(false);
      setShowE(false);
      setShowM3(false);
      setShowO3(false);
      setShowComplete(false);
      return;
    }
    
    const animationSequence = [
      { setter: setShowM1, delay: 300 },
      { setter: setShowO1, delay: 600 },
      { setter: setShowO2, delay: 900 },
      { setter: setShowD, delay: 1200 },
      { setter: setShowM2, delay: 1500 },
      { setter: setShowE, delay: 1800 },
      { setter: setShowM3, delay: 2100 },
      { setter: setShowO3, delay: 2400 },
      { setter: setShowComplete, delay: 2700 }
    ];

    animationSequence.forEach(({ setter, delay }) => {
      setTimeout(() => setter(true), delay);
    });

    // Hide animation after completion
    setTimeout(() => {
      setShowAnimation(false);
      if (onComplete) onComplete();
    }, 3500);
  }, [show, onComplete]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 flex-col">
      <div className="text-4xl md:text-6xl font-bold text-mood-primary mb-2 flex">
        <span className={`transition-opacity duration-300 ${showM1 ? 'opacity-100' : 'opacity-0'}`}>M</span>
        <span className={`transition-opacity duration-300 ${showO1 ? 'opacity-100' : 'opacity-0'}`}>o</span>
        <span className={`transition-opacity duration-300 ${showO2 ? 'opacity-100' : 'opacity-0'}`}>o</span>
        <span className={`transition-opacity duration-300 ${showD ? 'opacity-100' : 'opacity-0'}`}>d</span>
      </div>
      <div className="text-4xl md:text-6xl font-bold text-mood-primary flex">
        <span className={`transition-opacity duration-300 ${showM2 ? 'opacity-100' : 'opacity-0'}`}>M</span>
        <span className={`transition-opacity duration-300 ${showE ? 'opacity-100' : 'opacity-0'}`}>e</span>
        <span className={`transition-opacity duration-300 ${showM3 ? 'opacity-100' : 'opacity-0'}`}>m</span>
        <span className={`transition-opacity duration-300 ${showO3 ? 'opacity-100' : 'opacity-0'}`}>o</span>
      </div>
      <div className={`mt-8 opacity-0 transition-opacity duration-500 ${showComplete ? 'opacity-100' : ''}`}>
        <div className="w-16 h-16 border-4 border-t-mood-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default StartupAnimation;
