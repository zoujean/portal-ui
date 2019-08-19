import React from 'react';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';

import { IBucket } from '@ncigdc/components/Aggregations/types';

import { withTheme } from '@ncigdc/theme';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import NotMissingFacet from '@ncigdc/components/Aggregations/NotMissingFacet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { UploadSsmSet } from '@ncigdc/components/Modals/UploadSet';
import { ResultHighlights } from '@ncigdc/components/QuickSearch/QuickSearchResults';

const presetFacets: Array<{
  title: string,
  field: string,
  full: string,
  doc_type: string,
  type: string,
  additionalProps?: {},
}> = [
  {
    doc_type: 'ssms',
    field: 'ssm_id',
    full: 'ssms.ssm_id',
    title: 'SSM ID',
    type: 'id',
  },
  {
    doc_type: 'ssms',
    field: 'consequence.transcript.annotation.vep_impact',
    full: 'ssms.consequence.transcript.annotation.vep_impact',
    title: 'VEP Impact',
    type: 'terms',
  },
  {
    doc_type: 'ssms',
    field: 'consequence.transcript.annotation.sift_impact',
    full: 'ssms.consequence.transcript.annotation.sift_impact',
    title: 'SIFT Impact',
    type: 'terms',
  },
  {
    doc_type: 'ssms',
    field: 'consequence.transcript.annotation.polyphen_impact',
    full: 'ssms.consequence.transcript.annotation.polyphen_impact',
    title: 'Polyphen Impact',
    type: 'terms',
  },
  {
    doc_type: 'ssms',
    field: 'consequence.transcript.consequence_type',
    full: 'ssms.consequence.transcript.consequence_type',
    title: 'Consequence Type',
    type: 'terms',
  },
  {
    doc_type: 'ssms',
    field: 'mutation_subtype',
    full: 'ssms.mutation_subtype',
    title: 'Type',
    type: 'terms',
  },
  {
    doc_type: 'ssms',
    field: 'occurrence.case.observation.variant_calling.variant_caller',
    full: 'ssms.occurrence.case.observation.variant_calling.variant_caller',
    title: 'Variant Caller',
    type: 'terms',
  },
  {
    doc_type: 'ssms',
    field: 'cosmic_id',
    full: 'ssms.cosmic_id',
    title: 'COSMIC ID',
    type: 'notMissing',
  },
  {
    doc_type: 'ssms',
    field: 'consequence.transcript.annotation.dbsnp_rs',
    full: 'ssms.consequence.transcript.annotation.dbsnp_rs',
    title: 'dbSNP rs ID',
    type: 'notMissing',
  },
];

export type TProps = {
  hits: {
    edges: Array<{
      node: {
        id: string,
      },
    }>,
  },
  setAutocomplete: Function,
  theme: Object,
  suggestions: Array<{}>,
  idCollapsed: boolean,
  setIdCollapsed: Function,
  cosmicIdCollapsed: boolean,
  setCosmicIdCollapsed: boolean,
  relay: {},
  viewer: {
    explore: {
      ssms: {
        aggregations: {
          consequence__transcript__annotation__vep_impact: { buckets: [IBucket] },
          consequence__transcript__consequence_type: { buckets: [IBucket] },
          mutation_type: { buckets: [IBucket] },
        },
        cosmicIdNotMissing: {
          total: number
        },
        dbsnpRsNotMissing: {
          total: number
        }
      }
    }
  },
  dbSNPCollapsed: boolean,
  setDbSNPCollapsed: Function,
};

export const SSMAggregations = compose(
  withTheme,
  withState('idCollapsed', 'setIdCollapsed', false),
  withState('cosmicIdCollapsed', 'setCosmicIdCollapsed', false),
  withState('dbSNPCollapsed', 'setDbSNPCollapsed', false),
)(({
  cosmicIdCollapsed,
  dbSNPCollapsed,
  idCollapsed,
  maxFacetsPanelHeight,
  relay,
  setCosmicIdCollapsed,
  setIdCollapsed,
  theme,
  viewer: {
    explore: {
      ssms: {
        aggregations,
        cosmicIdNotMissing,
        dbsnpRsNotMissing,
      },
    },
  },
}: TProps) => (
  <div className="test-ssm-aggregations">
    <FacetHeader
      collapsed={idCollapsed}
      description="Enter Mutation UUID, DNA Change, Gene AA Change, COSMIC ID or dbSNP rs ID"
      field="ssms.ssm_id"
      setCollapsed={setIdCollapsed}
      title="Mutation"
      />
    <SuggestionFacet
      collapsed={idCollapsed}
      doctype="ssms"
      dropdownItem={(x, inputValue) => {
        return (
          <div>
            <div>
              <b>{x.ssm_id}</b>
            </div>
            <ResultHighlights
              item={x}
              query={inputValue}
              />
            <div>{x.genomic_dna_change}</div>
          </div>
        );
      }}
      fieldNoDoctype="ssm_id"
      placeholder="e.g. BRAF V600E, chr7:g.140753336A>T"
      queryType="ssm_centric"
      title="Mutation"
      />
    <UploadSetButton
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'ssms' },
      }}
      displayType="mutation"
      idField="ssms.ssm_id"
      style={{
        padding: '0 1.2rem 1rem',
        width: '100%',
      }}
      type="ssm"
      UploadModal={UploadSsmSet}
      >
      Upload Mutation Set
    </UploadSetButton>
    <div
      style={{
        maxHeight: `${maxFacetsPanelHeight - 68}px`, // 68 is the height of all elements above this div.
        overflowY: 'scroll',
      }}
      >
      {presetFacets
        .filter(
          ({ full }) => ![
            'ssms.ssm_id',
            'ssms.cosmic_id',
            'ssms.consequence.transcript.annotation.dbsnp_rs',
          ].includes(full),
        )
        .map(facet => (
          <FacetWrapper
            additionalProps={facet.additionalProps}
            aggregation={aggregations[escapeForRelay(facet.field)]}
            facet={facet}
            key={facet.full}
            relay={relay}
            title={facet.title}
            />
        ))}
      <FacetHeader
        collapsed={cosmicIdCollapsed}
        field="ssms.cosmic_id"
        setCollapsed={setCosmicIdCollapsed}
        style={{ borderTop: `1px solid ${theme.greyScale5}` }}
        title="COSMIC ID"
        />
      <NotMissingFacet
        collapsed={cosmicIdCollapsed}
        field="ssms.cosmic_id"
        notMissingDocCount={cosmicIdNotMissing.total}
        title="COSMIC ID"
        />
      <FacetHeader
        collapsed={cosmicIdCollapsed}
        field="ssms.consequence.transcript.annotation.dbsnp_rs"
        setCollapsed={setCosmicIdCollapsed}
        style={{ borderTop: `1px solid ${theme.greyScale5}` }}
        title="dbSNP rs ID"
        />
      <NotMissingFacet
        collapsed={dbSNPCollapsed}
        field="ssms.consequence.transcript.annotation.dbsnp_rs"
        notMissingDocCount={dbsnpRsNotMissing.total}
        title="dbSNP rs ID"
        />
    </div>
  </div>
));

export default SSMAggregations;
