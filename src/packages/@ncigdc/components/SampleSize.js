import React from 'react';
import _ from 'lodash';
import { css } from 'glamor';

const styles = {
  deemphasizedHeading: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
    fontSize: '0.8em',
    opacity: 0.8,
  },
};

export default ({
  n,
  style,
  formatter = x => x.toLocaleString(),
  symbol = 'n',
}) =>
  <span {...css({ ...styles.deemphasizedHeading, ...style })}>
    <small>( </small> {symbol}=
    {n ? formatter(n) : `--`}
    <small> )</small>
  </span>;
