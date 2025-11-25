import React from "react";

function BackgroundBeams() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions for beams */}
          <linearGradient id="beam-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.4)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </linearGradient>

          <linearGradient id="beam-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>

          <linearGradient id="beam-gradient-3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.35)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
          </linearGradient>

          <linearGradient id="beam-gradient-4" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>

          {/* Filter for glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated Beams */}
        <g className="beam-container" filter="url(#glow)">
          {/* Beam 1 - Diagonal from top-left */}
          <rect
            x="-50%"
            y="-10%"
            width="200%"
            height="3"
            fill="url(#beam-gradient-1)"
            transform="rotate(-25 0 0)"
            className="beam beam-1"
          />

          {/* Beam 2 - Diagonal from top-right */}
          <rect
            x="-50%"
            y="20%"
            width="200%"
            height="2"
            fill="url(#beam-gradient-2)"
            transform="rotate(25 0 0)"
            className="beam beam-2"
          />

          {/* Beam 3 - Vertical */}
          <rect
            x="30%"
            y="-50%"
            width="2"
            height="200%"
            fill="url(#beam-gradient-3)"
            className="beam beam-3"
          />

          {/* Beam 4 - Diagonal from bottom-left */}
          <rect
            x="-50%"
            y="60%"
            width="200%"
            height="2.5"
            fill="url(#beam-gradient-4)"
            transform="rotate(-35 0 0)"
            className="beam beam-4"
          />

          {/* Beam 5 - Horizontal */}
          <rect
            x="-50%"
            y="40%"
            width="200%"
            height="2"
            fill="url(#beam-gradient-1)"
            className="beam beam-5"
          />

          {/* Additional crossing beams */}
          <rect
            x="70%"
            y="-50%"
            width="1.5"
            height="200%"
            fill="url(#beam-gradient-2)"
            className="beam beam-6"
          />
        </g>
      </svg>

      {/* CSS Beam Overlays */}
      <div className="css-beam css-beam-1"></div>
      <div className="css-beam css-beam-2"></div>
      <div className="css-beam css-beam-3"></div>

      {/* Spotlight Beams */}
      <div className="spotlight-beam spotlight-beam-1" style={{ '--rotate': '-15deg' }}></div>
      <div className="spotlight-beam spotlight-beam-2" style={{ '--rotate': '12deg' }}></div>
      <div className="spotlight-beam spotlight-beam-3" style={{ '--rotate': '-8deg' }}></div>

      {/* Radial Beam Effects */}
      <div className="radial-beam radial-beam-1"></div>
      <div className="radial-beam radial-beam-2"></div>

      {/* Crossing Laser Beams */}
      <div className="laser-beam laser-beam-1"></div>
      <div className="laser-beam laser-beam-2"></div>
      <div className="laser-beam laser-beam-3"></div>

      {/* Glowing Orb Trails */}
      <div className="orb-trail orb-trail-1"></div>
      <div className="orb-trail orb-trail-2"></div>
    </div>
  );
}

export default BackgroundBeams;

