/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import { reject } from 'lodash';
import { connect } from 'react-redux';
import {
  compose,
  withState,
  setDisplayName,
  lifecycle,
  withPropsOnChange,
} from 'recompose';

import Modal from '@ncigdc/uikit/Modal';
import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import { Row } from '@ncigdc/uikit/Flex';
import FacetSelection from '@ncigdc/components/FacetSelection';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import CaseIcon from '@ncigdc/theme/icons/Case';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';

import { IBucket } from '@ncigdc/components/Aggregations/types';
import { CaseAggregationsQuery } from './explore.relay';
import CaseAdvancedAggregations from './CaseAdvancedAggregations';
export interface ITProps {
  caseIdCollapsed: boolean;
  setCaseIdCollapsed: (caseIdCollapsed: boolean) => void;
  relay: any;
  facets: { facets: string };
  parsedFacets: any;
  aggregations: {
    demographic__ethnicity: { buckets: [IBucket] };
    demographic__gender: { buckets: [IBucket] };
    demographic__race: { buckets: [IBucket] };
    diagnoses__vital_status: { buckets: [IBucket] };
    diagnoses__days_to_death: { max: number; min: number };
    diagnoses__age_at_diagnosis: { max: number; min: number };
    disease_type: { buckets: [IBucket] };
    primary_site: { buckets: [IBucket] };
    project__program__name: { buckets: [IBucket] };
    project__project_id: { buckets: [IBucket] };
  };
  hits: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
  setAutocomplete: any;
  theme: any;
  filters: any;
  suggestions: any;

  userSelectedFacets: Array<{
    description: any;
    doc_type: string;
    field: string;
    full: string;
    type: 'id' | 'string' | 'long';
  }>;
  handleSelectFacet: any;
  handleResetFacets: (event: any) => void;
  handleRequestRemoveFacet: any;
  shouldShowFacetSelection: boolean;
  facetExclusionTest: any;
  setShouldShowFacetSelection: any;
  advancedFilter: boolean;
  setAdvancedFilter: any;
}

const presetFacets = [
  {
    title: 'Case',
    field: 'case_id',
    full: 'cases.case_id',
    doc_type: 'cases',
    type: 'id',
  },
  {
    title: 'Case ID',
    field: 'submitter_id',
    full: 'cases.submitter_id',
    doc_type: 'cases',
    type: 'id',
    placeholder: 'eg. TCGA-DD*, *DD*, TCGA-DD-AAVP',
  },
  {
    title: 'Primary Site',
    field: 'primary_site',
    full: 'cases.primary_site',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Program',
    field: 'project.program.name',
    full: 'cases.project.program.name',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Project',
    field: 'project.project_id',
    full: 'cases.project.project_id',
    doc_type: 'cases',
    type: 'terms',
  },
  {
    title: 'Disease Type',
    field: 'disease_type',
    full: 'cases.disease_type',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Gender',
    field: 'demographic.gender',
    full: 'cases.demographic.gender',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Age at Diagnosis',
    field: 'diagnoses.age_at_diagnosis',
    full: 'cases.diagnoses.age_at_diagnosis',
    doc_type: 'cases',
    type: 'long',
    additionalProps: { convertDays: true },
  },
  {
    title: 'Vital Status',
    field: 'diagnoses.vital_status',
    full: 'cases.diagnoses.vital_status',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Days to Death',
    field: 'diagnoses.days_to_death',
    full: 'cases.diagnoses.days_to_death',
    doc_type: 'cases',
    type: 'long',
  },
  {
    title: 'Race',
    field: 'demographic.race',
    full: 'cases.demographic.race',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Ethnicity',
    field: 'demographic.ethnicity',
    full: 'cases.demographic.ethnicity',
    doc_type: 'cases',
    type: 'keyword',
  },
];

const entityType = 'ExploreCases';
const presetFacetFields = presetFacets.map(x => x.field);

const enhance = compose(
  setDisplayName('ExploreCaseAggregations'),
  withFacetSelection({
    entityType,
    presetFacetFields,
    validFacetDocTypes: ['cases'],
    validFacetPrefixes: [
      'cases.demographic',
      'cases.diagnoses',
      'cases.diagnoses.treatments',
      'cases.exposures',
      'cases.family_histories',
      'cases.project',
    ],
  }),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withState('advancedFilter', 'setAdvancedFilter', false),
  connect((state: any, props) => ({
    userSelectedFacets: state.customFacets[entityType],
  })),
  withPropsOnChange(
    ['filters', 'userSelectedFacets'],
    ({ filters, relay, userSelectedFacets }) =>
      relay.setVariables({
        filters,
        exploreCaseCustomFacetFields: userSelectedFacets
          .map(({ field }: any) => field)
          .join(','),
      })
  ),
  withPropsOnChange(['facets'], ({ facets }) => ({
    parsedFacets: facets.facets ? tryParseJSON(facets.facets, {}) : {},
  })),
  lifecycle({
    componentDidMount(): void {
      const { relay, filters, userSelectedFacets }: any = this.props;
      relay.setVariables({
        filters,
        exploreCaseCustomFacetFields: userSelectedFacets
          .map(({ field }: any) => field)
          .join(','),
      });
    },
  })
);

const styles = {
  link: {
    textDecoration: 'underline',
    color: '#2a72a5',
  },
};

export const CaseAggregationsComponent = ({
  caseIdCollapsed,
  setCaseIdCollapsed,
  relay,
  facets,
  parsedFacets,
  aggregations,
  hits,
  setAutocomplete,
  theme,
  filters,
  suggestions,
  userSelectedFacets,
  handleSelectFacet,
  handleResetFacets,
  handleRequestRemoveFacet,
  shouldShowFacetSelection,
  facetExclusionTest,
  setShouldShowFacetSelection,
  advancedFilter,
  setAdvancedFilter,
}: ITProps) => (
  <div className="test-case-aggregations">
    <div
      className="text-right"
      style={{
        padding: '10px 15px',
        borderBottom: `1px solid ${theme.greyScale5}`,
      }}
    >
      {!!userSelectedFacets.length && (
        <span>
          <a onClick={handleResetFacets} style={styles.link}>
            Reset
          </a>{' '}
          &nbsp;|&nbsp;
        </span>
      )}
      <a onClick={() => setShouldShowFacetSelection(true)} style={styles.link}>
        Add a Case Filter
      </a>
      {' | '}
      <a onClick={() => setAdvancedFilter(!advancedFilter)} style={styles.link}>
        {advancedFilter ? 'Basic Filter' : 'Advanced Filter'}
      </a>
    </div>

    <Modal
      isOpen={shouldShowFacetSelection}
      style={{ content: { border: 0, padding: '15px' } }}
    >
      <FacetSelection
        title="Add a Case Filter"
        relayVarName="exploreCaseCustomFacetFields"
        docType="cases"
        onSelect={handleSelectFacet}
        onRequestClose={() => setShouldShowFacetSelection(false)}
        excludeFacetsBy={facetExclusionTest}
        additionalFacetData={parsedFacets}
        relay={relay}
      />
    </Modal>
    {console.log(parsedFacets)}
    {userSelectedFacets.map(facet => (
      <FacetWrapper
        isRemovable
        relayVarName="exploreCaseCustomFacetFields"
        key={facet.full}
        facet={facet}
        aggregation={parsedFacets[facet.field]}
        relay={relay}
        onRequestRemove={() => handleRequestRemoveFacet(facet)}
        style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
      />
    ))}
    <FacetHeader
      title="Case"
      field="cases.case_id"
      collapsed={caseIdCollapsed}
      setCollapsed={setCaseIdCollapsed}
      description={
        'Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot'
      }
    />
    <SuggestionFacet
      title="Case"
      collapsed={caseIdCollapsed}
      doctype="cases"
      fieldNoDoctype="case_id"
      placeholder="e.g. TCGA-A5-A0G2, 432fe4a9-2..."
      hits={suggestions}
      setAutocomplete={setAutocomplete}
      dropdownItem={(x: any) => (
        <Row>
          <CaseIcon style={{ paddingRight: '1rem', paddingTop: '1rem' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.case_id}</div>
            <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
            {x.project.project_id}
          </div>
        </Row>
      )}
    />
    <UploadSetButton
      type="case"
      style={{
        width: '100%',
        borderBottom: `1px solid ${theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      UploadModal={UploadCaseSet}
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'cases' },
      }}
      idField="cases.case_id"
    >
      Upload Case Set
    </UploadSetButton>
    {advancedFilter ? (
      <CaseAdvancedAggregations />
    ) : (
      reject(presetFacets, { full: 'cases.case_id' })
        .filter(facet => aggregations[escapeForRelay(facet.field)])
        .map(facet => (
          <FacetWrapper
            key={facet.full}
            facet={facet}
            title={facet.title}
            aggregation={aggregations[escapeForRelay(facet.field)]}
            relay={relay}
            additionalProps={facet.additionalProps}
            style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
          />
        ))
    )}
  </div>
);

const CaseAggregations = Relay.createContainer(
  enhance(withTheme(CaseAggregationsComponent)),
  CaseAggregationsQuery
);

export default CaseAggregations;
