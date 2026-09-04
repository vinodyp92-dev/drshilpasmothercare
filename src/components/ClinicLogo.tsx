import React, { useState } from 'react';
import clinicLogoImg from '../assets/images/clinic_logo_1786435673240.jpg';

interface ClinicLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadgeBackground?: boolean;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = '',
  size = 'md',
  showBadgeBackground = true
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-32 sm:h-32'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const isCircle = className.includes('rounded-full');

  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105 ${
        isCircle ? 'rounded-full' : 'rounded-2xl'
      } ${
        showBadgeBackground 
          ? 'bg-white p-1 shadow-md shadow-pink-900/10 border-2 border-pink-200/90 ring-2 ring-pink-50' 
          : 'bg-white p-0.5 shadow-xs border border-pink-200'
      } ${currentSizeClass} ${className}`}
    >
      {!hasError ? (
        <img
          src={clinicLogoImg}
          alt="Dr. Shilpa's Mother Care logo"
          className={`w-full h-full object-contain ${isCircle ? 'rounded-full' : 'rounded-xl'}`}
          onError={() => setHasError(true)}
        />
      ) : (
        <MotherChildVectorLogo className="w-full h-full p-1 text-pink-700" />
      )}
    </div>
  );
};

export const MotherChildVectorLogo: React.FC<{ className?: string }> = ({ className = "w-full h-full text-purple-800" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="6" className="opacity-90" />
      
      {/* Mother Figure */}
      <path 
        d="M100 30 C70 30 50 55 50 85 C50 115 70 145 100 170 C110 150 115 130 110 110 C105 90 95 75 100 50 C102 40 106 35 100 30 Z" 
        fill="currentColor" 
      />
      
      {/* Mother Head */}
      <circle cx="105" cy="45" r="14" fill="currentColor" />

      {/* Baby Head */}
      <circle cx="130" cy="85" r="10" fill="currentColor" />

      {/* Heart Cradled */}
      <path 
        d="M115 100 C115 95 120 90 125 90 C130 90 135 95 135 100 C135 110 125 118 125 120 C125 118 115 110 115 100 Z" 
        fill="currentColor" 
      />

      {/* Arm Sweep around Baby */}
      <path 
        d="M90 85 C105 85 140 95 145 115 C140 135 110 145 85 130 C75 120 70 100 90 85 Z" 
        fill="currentColor" 
      />
    </svg>
  );
};
