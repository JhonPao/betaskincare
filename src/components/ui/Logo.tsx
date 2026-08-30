import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11"
  };

  return (
    <div className={`relative rounded-full bg-linear-to-br from-primary via-brand-primary-dark to-brand-accent-main flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 shrink-0 ${sizeClasses[size]}`}>
      {/* Icono vectorial K-Beauty: Gota de serum con hoja botánica y destello radiante */}
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5C12 2.5 6.5 9 6.5 13.8A5.5 5.5 0 0 0 17.5 13.8C17.5 9 12 2.5 12 2.5Z" fill="rgba(255, 255, 255, 0.25)" />
        <path d="M12 17.5V11C12 11 14.2 13 15.5 14.2" />
        <path d="M18.5 4L19 2.5L19.5 4L21 4.5L19.5 5L19 6.5L18.5 5L17 4.5L18.5 4Z" fill="white" stroke="none" />
      </svg>
    </div>
  );
};
