import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';

import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { parse } from 'query-string';
import { replaceFilters } from '@ncigdc/utils/filters';

export default (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location'],
    ({ defaultFilters = null, location: { search } }) => {
      const q = parse(search);
      const filters = parseFilterParam(q.filters, defaultFilters);
      const cosmicFilters = replaceFilters(
        {
          content: [
            {
              content: {
                field: 'cosmic_id',
                value: ['MISSING'],
              },
              op: 'not',
            },
          ],
          op: 'and',
        },
        filters,
      );
      const dbsnpRsFilters = replaceFilters(
        {
          content: [
            {
              content: {
                field: 'consequence.transcript.annotation.dbsnp_rs',
                value: ['MISSING'],
              },
              op: 'not',
            },
          ],
          op: 'and',
        },
        filters,
      );
      return {
        variables: {
          cosmicFilters,
          dbsnpRsFilters,
          filters,
        },
      };
    },
  ),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={578}
      parentProps={props}
      query={graphql`
          query SSMAggregations_relayQuery(
            $cosmicFilters: FiltersArgument
            $dbsnpRsFilters: FiltersArgument
            $filters: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  ) {
                    consequence__transcript__annotation__vep_impact {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    consequence__transcript__annotation__polyphen_impact {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    consequence__transcript__annotation__sift_impact {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    consequence__transcript__consequence_type {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    mutation_subtype {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    occurrence__case__observation__variant_calling__variant_caller {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  cosmicIdNotMissing: hits(filters: $cosmicFilters) {
                    total
                  }
                  dbsnpRsNotMissing: hits(filters: $dbsnpRsFilters) {
                    total
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
