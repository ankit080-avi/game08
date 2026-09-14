import React from 'react';

/**
 * Premium Player Pin / Location Marker
 * Visually matches the classic mobile Ludo marker:
 * - Tear-drop / map pin shape with colored gradient
 * - White inner ring with colored core
 * - Metallic drop shadow
 */
export const PlayerPin = ({ color = 'blue', className = '' }) => {
  const pinConfig = {
    red: {
      gradId: 'red-pin-grad',
      stop0: '#f87171',
      stop60: '#dc2626',
      stop100: '#991b1b',
      stroke: '#991b1b',
      core: '#dc2626'
    },
    green: {
      gradId: 'green-pin-grad',
      stop0: '#34d399',
      stop60: '#059669',
      stop100: '#064e3b',
      stroke: '#047857',
      core: '#059669'
    },
    yellow: {
      gradId: 'yellow-pin-grad',
      stop0: '#fde047',
      stop60: '#d97706',
      stop100: '#78350f',
      stroke: '#b45309',
      core: '#d97706'
    },
    blue: {
      gradId: 'blue-pin-grad',
      stop0: '#60a5fa',
      stop60: '#2563eb',
      stop100: '#1e3a8a',
      stroke: '#1d4ed8',
      core: '#2563eb'
    }
  };

  const cfg = pinConfig[color] || pinConfig.blue;

  return (
    <svg
      viewBox="0 0 24 32"
      className={`w-6 h-8 sm:w-7 sm:h-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={cfg.gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cfg.stop0} />
          <stop offset="60%" stopColor={cfg.stop60} />
          <stop offset="100%" stopColor={cfg.stop100} />
        </linearGradient>
      </defs>
      {/* Pin Body */}
      <path
        d="M12 1.5 C6.8 1.5 2.5 5.8 2.5 11 C2.5 18 12 30.5 12 30.5 C12 30.5 21.5 18 21.5 11 C21.5 5.8 17.2 1.5 12 1.5 Z"
        fill={`url(#${cfg.gradId})`}
        stroke={cfg.stroke}
        strokeWidth="1.5"
      />
      {/* Inner White Ring & Core */}
      <circle cx="12" cy="11" r="5" fill="#ffffff" />
      <circle cx="12" cy="11" r="2.8" fill={cfg.core} />
    </svg>
  );
};
