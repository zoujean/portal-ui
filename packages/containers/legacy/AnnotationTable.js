/* @flow */

import React from 'react';
import Relay from 'react-relay';

import Pagination from '../Pagination';

import AnnotationTr from './AnnotationTr';

import type { TTableProps } from '../types';

export const AnnotationTableComponent = (props: TTableProps) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>UUID</th>
          <th>Case UUID</th>
          <th>Project</th>
          <th>Entity Type</th>
          <th>Entity UUID</th>
          <th>Category</th>
          <th>Classification</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody>
        {props.hits.edges.map(e => (
          <AnnotationTr {...e} key={e.node.id} />
        ))}
      </tbody>
    </table>
    <Pagination pagination={props.hits.pagination} />
  </div>
);

export const AnnotationTableQuery = {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on AnnotationConnection {
        pagination {
          sort
          ${Pagination.getFragment('pagination')}
        }
        edges {
          node {
            id
            ${AnnotationTr.getFragment('node')}
          }
        }
      }
    `,
  },
};

const AnnotationTable = Relay.createContainer(
  AnnotationTableComponent,
  AnnotationTableQuery
);

export default AnnotationTable;
