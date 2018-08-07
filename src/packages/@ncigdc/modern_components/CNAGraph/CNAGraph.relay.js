/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import withRouter from '@ncigdc/utils/withRouter';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['filters', 'location', 'caseId'],
      ({ filters, caseId }) => {
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
                    value: [caseId],
                  },
                },
              ],
            },
          },
        };
      },
    ),
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
                        # cna_id
                        # chromosome
                        # cna_change
                        # start_position
                        # end_position
                        # case {
                        #   available_variation_data
                        # }
                        # occurrence {
                        #   occurrence_id
                        # }
                        # consequence {
                        #   consequence_id
                        #   gene {
                        #     symbol
                        #     gene_id
                        #     is_cancer_gene_census
                        #     biotype
                        #   }
                        # }
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

//   {
//   "query": {
//
//     "bool": {
//       "must": [
//         {
//
//           "match": {
//             "occurrence.case.case_id": "1fc81cd4-fa89-4135-8c3c-027ffae82b05"
//           }
//         }
//       ]
//     }
//   }
// }
