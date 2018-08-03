import React from 'react';
import * as d3 from 'd3';
import {
  compose,
  branch,
  renderComponent,
  withProps,
  withState,
} from 'recompose';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Row } from '@ncigdc/uikit/Flex';

export default compose(
  withTooltip,
  // branch(({ cna }) => !cna, renderComponent(() => <div>Not enough data.</div>)),
)(({ location }) => {
  return <Row>This is the chromosome graph</Row>;
});
