import React, { useMemo } from 'react';

export default function Snowfall({ count = 35 }) {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 7}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${10 + Math.random() * 16}px`,
      opacity: 0.3 + Math.random() * 0.6,
      char: ['❄', '❅', '❆', '•'][Math.floor(Math.random() * 4)]
    }));
  }, [count]);

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            fontSize: flake.fontSize,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            opacity: flake.opacity
          }}
        >
          {flake.char}
        </span>
      ))}
    </div>
  );
}
