import React from 'react';
import _ from 'lodash';
import {
  compose,
  withState,
  setDisplayName,
  // lifecycle,
  // withPropsOnChange,
} from 'recompose';

// import Modal from '@ncigdc/uikit/Modal';
import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';
// import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import { Row } from '@ncigdc/uikit/Flex';
// import FacetSelection from '@ncigdc/components/FacetSelection';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import CaseIcon from '@ncigdc/theme/icons/Case';
// import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
// import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';


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
    demographic__days_to_death: { max: number, min: number },
    demographic__vital_status: { buckets: [IBucket] },
    diagnoses__age_at_diagnosis: { max: number, min: number },
    disease_type: { buckets: [IBucket] },
    primary_site: { buckets: [IBucket] },
    project__program__name: { buckets: [IBucket] },
    project__project_id: { buckets: [IBucket] },
  },
  hits: {
    edges: Array<{
      node: {
        id: string,
      },
    }>,
  },
  setAutocomplete: Function,
  theme: Object,
  filters: Object,
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

// const entityType = 'ExploreCases';
// const presetFacetFields = presetFacets.map(x => x.field);

const enhance = compose(
  setDisplayName('ExploreCaseAggregations'),
  withTheme,
  // withFacetSelection({
  //   entityType,
  //   presetFacetFields,
  //   validFacetDocTypes: ['cases'],
  //   validFacetPrefixes: [
  //     'cases.demographic',
  //     'cases.diagnoses',
  //     'cases.diagnoses.treatments',
  //     'cases.exposures',
  //     'cases.family_histories',
  //     'cases.project',
  //   ],
  // }),
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  // connect((state, props) => ({
  //   userSelectedFacets: state.customFacets[entityType],
  // })),
  // withPropsOnChange(
  //   ['filters', 'userSelectedFacets'],
  //   ({ filters, relay, userSelectedFacets }) => relay.setVariables({
  //     filters,
  //     exploreCaseCustomFacetFields: userSelectedFacets
  //       .map(({ field }) => field)
  //       .join(','),
  //   }),
  // ),
  // withPropsOnChange(['viewer'], ({ viewer }) => ({
  //   parsedFacets: viewer.explore.cases.facets
  //     ? tryParseJSON(viewer.explore.cases.facets, {})
  //     : {},
  // })),
  // withPropsOnChange(['facets'], ({ facets }) => ({
  //   parsedFacets: facets.facets ? tryParseJSON(facets.facets, {}) : {},
  // })),
  // lifecycle({
  //   componentDidMount(): void {
  //     const { filters, relay, userSelectedFacets } = this.props;
  //     relay.setVariables({
  //       filters,
  //       exploreCaseCustomFacetFields: userSelectedFacets
  //         .map(({ field }) => field)
  //         .join(','),
  //     });
  //   },
  // }),
);

// const styles = {
//   link: {
//     color: '#2a72a5',
//     textDecoration: 'underline',
//   },
// };

const ExploreCasesAggregations = ({
  caseIdCollapsed,
  // facetExclusionTest,
  // handleRequestRemoveFacet,
  // handleResetFacets,
  // handleSelectFacet,
  // parsedFacets,
  relay,
  setCaseIdCollapsed,
  // setShouldShowFacetSelection,
  // shouldShowFacetSelection,
  theme,
  // userSelectedFacets,
  viewer: {
    explore: {
      cases: {
        aggregations,
      },
    },
  },
}: TProps) => (
  <div className="test-case-aggregations">
    {/* <div
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
          </a>
          {' '}
          &nbsp;|&nbsp;
        </span>
      )}
      <a
        onClick={() => setShouldShowFacetSelection(true)}
        style={styles.link}
        >
        Add a Case Filter
      </a>
    </div> */}
    {/* <Modal
      isOpen={shouldShowFacetSelection}
      style={{
        content: {
          border: 0,
          padding: '15px',
          width: '65%',
        },
      }}
      >
      <FacetSelection
        additionalFacetData={parsedFacets}
        docType="cases"
        excludeFacetsBy={facetExclusionTest}
        onRequestClose={() => setShouldShowFacetSelection(false)}
        onSelect={handleSelectFacet}
        relay={relay}
        relayVarName="exploreCaseCustomFacetFields"
        title="Add a Case Filter"
        />
    </Modal> */}

    {/* {userSelectedFacets.map(facet => (
      <FacetWrapper
        aggregation={parsedFacets[facet.field]}
        facet={facet}
        isRemovable
        key={facet.full}
        onRequestRemove={() => handleRequestRemoveFacet(facet)}
        relay={relay}
        relayVarName="exploreCaseCustomFacetFields"
        style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
        />
    ))} */}
    <FacetHeader
      collapsed={caseIdCollapsed}
      description="Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot"
      field="cases.case_id"
      setCollapsed={setCaseIdCollapsed}
      title="Case"
      />
    <SuggestionFacet
      collapsed={caseIdCollapsed}
      doctype="cases"
      dropdownItem={x => (
        <Row>
          <CaseIcon style={{
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
        pathname: '/exploration',
        query: { searchTableTab: 'cases' },
      }}
      idField="cases.case_id"
      style={{
        width: '100%',
        borderBottom: `1px solid ${theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      type="case"
      UploadModal={UploadCaseSet}
      >
      Upload Case Set
    </UploadSetButton>

    {_.reject(presetFacets, { full: 'cases.case_id' })
      .filter(facet => aggregations[escapeForRelay(facet.field)])
      .map(facet => (
        <FacetWrapper
          additionalProps={facet.additionalProps}
          aggregation={aggregations[escapeForRelay(facet.field)]}
          facet={facet}
          key={facet.full}
          relay={relay}
          style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
          title={facet.title}
          />
      ))}
  </div>
);

export default enhance(ExploreCasesAggregations);
