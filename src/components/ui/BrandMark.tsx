import React from 'react';

interface BrandMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div className={`inline-flex items-center justify-center bg-[#263746] text-white rounded flex-shrink-0 ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4/6 h-4/6 text-white"
        aria-hidden="true"
      >
        {/* Abstract Institutional Progression Symbol: Document Base (File) + Forward/Upward Verification Flow */}
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" strokeWidth="2.5" />
      </svg>
    </div>
  );
};
