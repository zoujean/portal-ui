import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import _ from 'lodash';

import {
  compose,
  branch,
  renderComponent,
  withProps,
  withState,
} from 'recompose';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Row } from '@ncigdc/uikit/Flex';
import scores from './cna_scores';

export default compose(
  withTooltip,
  // branch(({ cna }) => !cna, renderComponent(() => <div>Not enough data.</div>)),
)(({ location }, ...props) => {
  let data = scores;

  // const {
  //   domainWidth = 500,
  //   highlightedPointId = ``,
  //   yAxisOffset = 45,
  //   xAxisOffset = 40,
  // } = props;
  let chartRoot = ReactFauxDOM.createElement('div');

  let d3Root = d3.select(chartRoot);

  let svg = d3Root.append('svg').attr('overflow', 'visible'),
    margin = { top: 20, right: 20, bottom: 70, left: 0 },
    width = 1350 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let g = svg.append('g');

  if (data.length) {
    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear();
    // let tickInterval = 50;
    // let tickValues = data
    //   .map(function(d) {
    //     return d.date;
    //   })
    //   .filter(function(d, i) {
    //     return i % tickInterval === 0;
    //   });
    let xAxisLower = d3
      .axisBottom(x)
      .ticks(10)
      .tickPadding(1);
    // .tickValues(tickValues);

    x.domain([0, data.length]);
    y.domain(d3.extent(data, d => d.score)).range([0, height]);

    g
      .append('g')
      .attr('class', 'axis axisx')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisLower)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-90)')
      .attr('font-size', '0.9em');
    g
      .append('text')
      .attr(
        'transform',
        'translate(' + width / 2 + ' ,' + (height + margin.top + 50) + ')',
      )
      .style('text-anchor', 'middle')
      .text('Chromosome');

    g
      .append('g')
      .attr('class', 'axis axis--y')
      .call(
        d3
          .axisLeft(y)
          .ticks(2)
          .tickFormat(function(d) {
            return parseInt(d);
          })
          .tickSizeInner([-width]),
      )
      .append('text')
      .attr('transform', 'rotate(-90),translate(0,-50)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .attr('fill', '#5D6971')
      .text('Copy Number Variation Score');

    // g
    //   .selectAll('.bar')
    //   .data(data)
    //   .enter()
    //   .append('rect')
    //   .attr('x', function(d) {
    //     return x(d.start);
    //   })
    //   .attr('y', function(d) {
    //     return y(d.score);
    //   })
    //   .attr('width', 1)
    //   .attr('height', function(d) {
    //     return height - y(d.score);
    //   })
    // .attr('fill', function(d) {
    //   return 'red';
    // });

    g
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {
        return x(d.start);
      })
      .attr('y', function(d) {
        return y(Math.min(0, d.score));
      })
      .attr('width', 0.6)
      .attr('height', function(d) {
        return Math.abs(y(d.score) - y(0));
      })
      .attr('fill', function(d) {
        return 'red';
      });
    // .on('mousemove', function(d) {
    //   tooltip
    //     .style('left', d3.event.pageX - 50 + 'px')
    //     .style('top', d3.event.pageY - 70 + 'px')
    //     .style('display', 'inline-block')
    //     .html(d.area + '<br>' + '£' + d.value);
    // })
    // .on('mouseout', function(d) {
    //   tooltip.style('display', 'none');
    // });

    return chartRoot.toReact();
    // return <Row>This is the chromosome graph</Row>;
  } else {
    return <div>No data</div>;
  }
});
