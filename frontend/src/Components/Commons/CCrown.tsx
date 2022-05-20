import React from 'react';

interface CCrownProps {
  color?: string;
  width?: number | string;
  height?: number | string;
}

function CCrown({ color = '#cdcdcd', width = 20, height = 25 }: CCrownProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 119 84"
      fill={color}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 16.0774L36.346 36.0655L58.7511 0L81.1561 36.0655L118 16.0774L105.5 73H12.5L0 16.0774Z"
        fill={color}
      />
      <path d="M13 85H105V98H13V85Z" fill={color} />
    </svg>
  );
}

export default CCrown;
