import React from 'react';

const LEVEL_COLOR = [
  '#CDCDCD',
  '#1D7FDE',
  '#1AB4E3',
  '#16D772',
  '#23CA1B',
  '#9AD211',
  '#E6BC0C',
  '#F09F0F',
  '#FF6800',
  '#F0165F',
  '#901AE3',
];

interface CClassBadgeProps {
  level: number;
  width?: number;
  height?: number;
  labelOff?: boolean;
}

function CClassBadge({ level, width = 50, height = 50, labelOff = false }: CClassBadgeProps) {
  return (
    <div style={{ position: 'relative', width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 87 87"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect
          x="43.4265"
          y="1"
          width="60"
          height="60"
          rx="5"
          transform="rotate(45 43.4265 1)"
          fill={LEVEL_COLOR[level]}
        />
        <rect
          x="43.4265"
          y="-1.12132"
          width="63"
          height="63"
          rx="6.5"
          transform="rotate(45 43.4265 -1.12132)"
          stroke="#DDDDDD"
          stroke-opacity="0.5"
          stroke-width="3"
        />
        <rect
          x="42.8201"
          y="11"
          width="45"
          height="45"
          rx="5"
          transform="rotate(45 42.8201 11)"
          fill="url(#paint0_linear_1088_70)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1088_70"
            x1="88.2023"
            y1="56.1274"
            x2="42.9475"
            y2="10.8726"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div
        style={{
          position: 'absolute',
          top: height / 2,
          left: width / 2,
          color: '#000',
          fontSize: 16,
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
        <span style={{ textShadow: '-2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff' }}>
          {labelOff || level}
        </span>
      </div>
    </div>
  );
}

export default CClassBadge;
