/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import withRouter from '@ncigdc/utils/withRouter';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['filters', 'location'], ({ filters }) => {
      return {
        variables: {
          // first: 10000,
          filters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'occurrence.case.case_id',
                  value: '',
                },
              },
            ],
          },
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CNAGraph_relayQuery($filters: FiltersArgument) {
            viewer {
              explore {
                cases {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        case_id
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      />
    );
  });
