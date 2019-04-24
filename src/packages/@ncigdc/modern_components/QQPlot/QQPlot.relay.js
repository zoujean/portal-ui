import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';

export default (Component: ReactClass<*>) =>
  compose(
    // branch(
    //   ({ typeName }) => !typeName,
    //   renderComponent(() => (
    //     <div>
    //       <pre>Type name</pre> must be provided
    //     </div>
    //   ))
    // ),
    withPropsOnChange(['filters'], ({ filters }) => ({
      variables: {
        filters: {
          op: 'and',
          content: [
            {
              op: 'NOT',
              content: {
                field: 'cases.diagnoses.age_at_diagnosis',
                value: ['MISSING'],
              },
            },
          ],
        },
      },
    }))
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query QQPlot_relayQuery($filters: FiltersArgument) {
            viewer {
                explore {
                  cases {
                    hits(first: 1000) {
                      edges {
                        node {
                          diagnoses {
                            hits(first: 500, filters: $filters) {
                              edges {
                                node {
                                  age_at_diagnosis
                                }
                              }
                            }
                          }
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
