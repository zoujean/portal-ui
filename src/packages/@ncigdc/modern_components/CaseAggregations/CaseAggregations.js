/* @flow */
import React from 'react';
import _ from 'lodash';
import {
  compose,
  withState,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import Modal from '@ncigdc/uikit/Modal';
import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';
import { Row } from '@ncigdc/uikit/Flex';
import FacetSelection from '@ncigdc/modern_components/FacetSelection';
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

export type TProps = {
  caseIdCollapsed: boolean,
  setCaseIdCollapsed: Function,
  relay: Object,
  facets: { facets: string },
  parsedFacets: Object,
  aggregations: {
    demographic__ethnicity: { buckets: [IBucket] },
    demographic__gender: { buckets: [IBucket] },
    demographic__race: { buckets: [IBucket] },
    demographic__vital_status: { buckets: [IBucket] },
    demographic__days_to_death: { stats: { max: number, min: number } },
    diagnoses__age_at_diagnosis: { stats: { max: number, min: number } },
    disease_type: { buckets: [IBucket] },
    primary_site: { buckets: [IBucket] },
    project__program__name: { buckets: [IBucket] },
    project__project_id: { buckets: [IBucket] },
  },
  setAutocomplete: Function,
  theme: Object,
  suggestions: Array<Object>,

  userSelectedFacets: Array<{
    description: String,
    doc_type: String,
    field: String,
    full: String,
    type: 'id' | 'string' | 'long',
  }>,
  handleSelectFacet: Function,
  handleResetFacets: Function,
  handleRequestRemoveFacet: Function,
  presetFacetFields: Array<String>,
  shouldShowFacetSelection: Boolean,
  facetExclusionTest: Function,
  setShouldShowFacetSelection: Function,
};

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
    field: 'demographic.vital_status',
    full: 'cases.demographic.vital_status',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Days to Death',
    field: 'demographic.days_to_death',
    full: 'cases.demographic.days_to_death',
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

const presetFacetFields = presetFacets.map(x => x.field);
const entityType = 'RepositoryCases';

const enhance = compose(
  setDisplayName('RepoCaseAggregations'),
  withFacetSelection({
    entityType,
    presetFacetFields,
    validFacetDocTypes: ['cases'],
  }),
  withTheme,
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets: viewer.repository.cases.facets
      ? tryParseJSON(viewer.repository.cases.facets, {})
      : {},
  })),
);

const styles = {
  link: {
    textDecoration: 'underline',
    color: '#2a72a5',
  },
};

const CaseAggregationsComponent = (props: TProps) => (
  <div className="test-case-aggregations">
    <div
      className="text-right"
      style={{
        padding: '10px 15px',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
      }}
      >
      {!!props.userSelectedFacets.length && (
        <span>
          <a onClick={props.handleResetFacets} style={styles.link}>
            Reset
          </a>
          {' '}
          &nbsp;|&nbsp;
        </span>
      )}
      <a
        onClick={() => props.setShouldShowFacetSelection(true)}
        style={styles.link}
        >
        Add a Case/Biospecimen Filter
      </a>
    </div>
    <Modal
      isOpen={props.shouldShowFacetSelection}
      shouldNotCloseOnEsc
      style={{
        content: {
          border: 0,
          padding: '15px',
          width: '65%',
        },
      }}
      >
      <FacetSelection
        additionalFacetData={props.parsedFacets}
        docType="cases"
        excludeFacetsBy={props.facetExclusionTest}
        isCaseInsensitive
        onRequestClose={() => props.setShouldShowFacetSelection(false)}
        onSelect={props.handleSelectFacet}
        title="Add a Case/Biospecimen Filter"
        />
    </Modal>

    {props.userSelectedFacets.map(facet => (
      <FacetWrapper
        aggregation={props.parsedFacets[facet.field]}
        facet={facet}
        isRemovable
        key={facet.full}
        onRequestRemove={() => props.handleRequestRemoveFacet(facet)}
        relayVarName="repoCaseCustomFacetFields"
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
        />
    ))}

    <FacetHeader
      collapsed={props.caseIdCollapsed}
      description="Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot"
      field="cases.case_id"
      setCollapsed={props.setCaseIdCollapsed}
      title="Case"
      />

    <SuggestionFacet
      collapsed={props.caseIdCollapsed}
      doctype="cases"
      dropdownItem={x => (
        <Row>
          <CaseIcon
            style={{
              paddingRight: '1rem',
              paddingTop: '1rem',
            }}
            />
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.case_id}</div>
            <div style={{ fontSize: '80%' }}>{x.submitter_id}</div>
            {x.project.project_id}
          </div>
        </Row>
      )}
      fieldNoDoctype="case_id"
      placeholder="e.g. TCGA-A5-A0G2, 432fe4a9-2..."
      queryType="case"
      title="Case"
      />
    <UploadSetButton
      defaultQuery={{
        pathname: '/repository',
        query: { searchTableTab: 'cases' },
      }}
      idField="cases.case_id"
      style={{
        width: '100%',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      type="case"
      UploadModal={UploadCaseSet}
      >
      Upload Case Set
    </UploadSetButton>

    {_.reject(presetFacets, { full: 'cases.case_id' }).map(facet => (
      <FacetWrapper
        additionalProps={facet.additionalProps}
        aggregation={
          props.viewer.repository.cases.aggregations[
            escapeForRelay(facet.field)
        ]
        }
        facet={facet}
        key={facet.full}
        relay={props.relay}
        title={facet.title}
        />
    ))}
  </div>
);

export default enhance(CaseAggregationsComponent);
