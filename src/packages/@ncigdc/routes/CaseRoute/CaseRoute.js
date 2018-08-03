// @flow
import React from 'react';
import { parse } from 'query-string';
import Column from '@ncigdc/uikit/Flex/Column';
import Row from '@ncigdc/uikit/Flex/Row';
import ClinicalCard from '@ncigdc/modern_components/ClinicalCard';
import CaseSummary from '@ncigdc/modern_components/CaseSummary';
import AddOrRemoveAllFilesButton from '@ncigdc/modern_components/AddOrRemoveAllFilesButton';
import {
  CaseCountsDataCategory,
  CaseCountsExpStrategy,
} from '@ncigdc/modern_components/CaseCounts';
import BiospecimenCard from '@ncigdc/modern_components/BiospecimenCard';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import Exists from '@ncigdc/modern_components/Exists';
import CaseSymbol from '@ncigdc/modern_components/CaseSymbol';
import HasSsms from '@ncigdc/modern_components/HasSsms';
import MutationsCard from '@ncigdc/modern_components/MutationsCard';

const styles = {
  column: {
    flexGrow: 1,
  },
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
  card: {
    backgroundColor: 'white',
  },
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
};

export default ({
  match,
  caseId = match.params.id,
  location,
  query = parse(location.search),
}: Object) => {
  return (
    <Exists type="Case" id={caseId}>
      <FullWidthLayout title={<CaseSymbol caseId={caseId} />} entityType="CA">
        <Column spacing="2rem" className="test-case">
          <Row style={{ justifyContent: 'flex-end' }}>
            <AddOrRemoveAllFilesButton
              caseId={caseId}
              style={{ width: 'auto' }}
            />
          </Row>
          <CaseSummary caseId={caseId} />
          <Row style={{ flexWrap: 'wrap' }} spacing={'2rem'}>
            <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
              <CaseCountsDataCategory caseId={caseId} />
            </span>
            <span style={{ ...styles.column, marginBottom: '2rem', flex: 1 }}>
              <CaseCountsExpStrategy caseId={caseId} />
            </span>
          </Row>

          <Row id="clinical" style={{ flexWrap: 'wrap' }} spacing="2rem">
            <ClinicalCard caseId={caseId} />
          </Row>

          <Row id="biospecimen" style={{ flexWrap: 'wrap' }} spacing="2rem">
            <BiospecimenCard caseId={caseId} bioId={query.bioId} />
          </Row>
          <Row id="mutations" style={{ flexWrap: 'wrap' }} spacing="2rem">
            <HasSsms caseId={caseId}>
              <MutationsCard caseId={caseId} />
            </HasSsms>
          </Row>
        </Column>
      </FullWidthLayout>
    </Exists>
  );
};
