import React from 'react';
export default ({ value, width = 30, max = 30, ...props }) =>
  <div
    style={{
      display: 'inline-block',
      position: 'relative',
      height: 8,
      width: width + 10,
    }}
    {...props}
  >
    <span
      style={{
        position: 'absolute',
        right: 0,
        display: 'inline-block',
        width,
        height: 8,
        backgroundColor: `rgb(209, 209, 209)`,
        margin: '0 5px',
        borderRadius: 2,
      }}
    />
    <span
      style={{
        position: 'absolute',
        left: 0,
        display: 'inline-block',
        width: value > 0 ? Math.max(value * max, 2) : 0,
        height: 8,
        backgroundColor: `rgb(39, 156, 75)`,
        margin: '0 5px',
        borderRadius: 2,
      }}
    />
  </div>;
