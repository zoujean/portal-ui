import React from 'react';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import SparkMeter from '@ncigdc/uikit/SparkMeter';

export default ({ part, whole }) =>
  <Tooltip
    Component={`${(part / whole * 100).toFixed(2)}%`}
    style={{ display: 'block', width: '100%' }}
  >
    <SparkMeter
      value={part / whole}
      aria-label={`${(part / whole * 100).toFixed(2)}%`}
      role="figure"
      height={3}
      style={{
        //width: 'calc(100% + 6px)',
        width: 40,
        position: 'absolute',
        bottom: -3,
        right: 0,
        //left: -3,
        margin: 0,
      }}
    />
  </Tooltip>;
