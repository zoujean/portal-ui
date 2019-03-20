import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import {
  compose,
  withPropsOnChange,
  branch,
  renderComponent,
  withProps,
} from 'recompose';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ facetFields }) => !facetFields,
      renderComponent(() => (
        <div>
          <pre>Facets must be provided</pre>
        </div>
      ))
    ),
    withPropsOnChange(
      ['globalFilters', 'facetFields'],
      ({ globalFilters, facetFields }) => ({
        variables: { filters: globalFilters, facetFields },
      })
    )
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ClinicalAggregations_relayQuery($filters: FiltersArgument! $facetFields: [String]!) {
            explore {
              cases {
                facets(facets: $facetFields)
              }
            }
          }
        `}
      />
    );
  });
