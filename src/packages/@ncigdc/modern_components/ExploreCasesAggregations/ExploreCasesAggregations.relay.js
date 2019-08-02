import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
// import { connect } from 'react-redux';
import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { parse } from 'query-string';

// const entityType = 'ExploreCases';

export default (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location'],
    ({ defaultFilters = null, location: { search } }) => {
      const q = parse(search);
      const filters = parseFilterParam(q.filters, defaultFilters);
      return {
        variables: {
          filters,
        },
      };
    },
  ),
  // connect((state, props) => ({
  //   userSelectedFacets: state.customFacets[entityType],
  // })),
  // withPropsOnChange(
  //   ['userSelectedFacets', 'filters'],
  //   ({ filters, userSelectedFacets }) => {
  //     return {
  //       variables: {
  //         exploreCaseCustomFacetFields: userSelectedFacets
  //           .map(({ field }) => field)
  //           .join(','),
  //         filters,
  //       },
  //     };
  //   },
  // ),
)((props: Object) => {
  return (
    <Query
        Component={Component}
        minHeight={578}
        parentProps={props}
        query={graphql`
          query ExploreCasesAggregations_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              explore {
                cases {
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  ) {
                    primary_site {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    project__program__name {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    disease_type {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    demographic__gender {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    diagnoses__age_at_diagnosis {
                      stats {
                        max
                        min
                        count
                      }
                    }
                    demographic__vital_status {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    demographic__days_to_death {
                      stats {
                        max
                        min
                        count
                      }
                    }
                    demographic__race {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    demographic__ethnicity {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                }
              }
            }
          }
        `}
        variables={props.variables}
        />
  );
});
