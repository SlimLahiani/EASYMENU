import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean;
}

export const KayuLogo: React.FC<LogoProps> = ({ className = "h-24 w-auto", light = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Render the actual uploaded logo image with absolutely no modifications */}
      <img 
        src="/logo.png" 
        alt="KAYU Sushi Logo" 
        className="h-full w-auto max-h-[140px] object-contain select-none pointer-events-none"
      />
    </div>
  );
};

export default KayuLogo;
