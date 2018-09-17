import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultSize = 10, defaultFilters = null }) => {
        const q = parse(search);
        const score = 'case.project.project_id';
        const sort = parseJSONParam(q.genes_sort, null);
        return {
          filters: defaultFilters,
          score,
          sort,
          variables: {
            genesTable_filters: parseFilterParam(
              q.genesTable_filters,
              defaultFilters,
            ),
            genesTable_offset: parseIntParam(q.genesTable_offset, 0),
            genesTable_size: parseIntParam(q.genesTable_size, defaultSize),
            geneCaseFilter: addInFilters(
              q.genesTable_filters || defaultFilters,
              makeFilter([
                {
                  field: 'cases.available_variation_data',
                  value: 'ssm',
                },
              ]),
            ),
            score,
            genes_sort: sort,
            ssmTested: makeFilter([
              {
                field: 'cases.available_variation_data',
                value: 'ssm',
              },
            ]),
          },
        };
      },
    ),
  )((props: mixed) => {
    return (
      <Query
        parentProps={props}
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query GenesTable_relayQuery(
            $genesTable_filters: FiltersArgument
            $genesTable_size: Int
            $genesTable_offset: Int
            $score: String
            $geneCaseFilter: FiltersArgument
            $ssmTested: FiltersArgument
            $genes_sort: [Sort]
          ) {
            genesTableViewer: viewer {
              explore {
                cases {
                  hits(first: 0, filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(first: 0, filters: $geneCaseFilter) {
                    total
                  }
                }
                genes {
                  hits(
                    first: $genesTable_size
                    offset: $genesTable_offset
                    filters: $genesTable_filters
                    score: $score
                    sort: $genes_sort
                  ) {
                    total
                    edges {
                      node {
                        id
                        numCases: score
                        symbol
                        name
                        cytoband
                        biotype
                        gene_id
                        is_cancer_gene_census
                        case {
                          hits(first: 0, filters: $ssmTested) {
                            total
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
