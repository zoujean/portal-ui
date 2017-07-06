import React from 'react';
export default ({ value, width = 30, max = 30, height = 8, style, ...props }) =>
  <div
    style={{
      width,
      height,
      backgroundColor: `rgb(209, 209, 209)`,
      margin: '0 5px',
      borderRadius: 2,
      display: 'inline-block',
      pointerEvents: 'none',
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        position: 'absolute',
        right: 0,
        width: value > 0 ? Math.max(value * max, 2) : 0,
        height,
        backgroundColor: `rgb(39, 156, 75)`,
        borderRadius: 2,
      }}
    />
  </div>;
