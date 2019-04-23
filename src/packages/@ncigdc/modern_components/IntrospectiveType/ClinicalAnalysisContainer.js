import React from 'react';
import ClinicalAnalysisResult from '@ncigdc/modern_components/ClinicalAnalysis';
import { compose, withProps, branch } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import { connect } from 'react-redux';
import QQPlot from '@ncigdc/components/QQPlot';
import _ from 'lodash';

import { CLINICAL_BLACKLIST } from '@ncigdc/utils/constants';

const validClinicalTypesRegex = /(demographic)|(diagnoses)|(exposures)|(treatments)|(follow_ups)/;
const blacklistRegex = new RegExp(
  CLINICAL_BLACKLIST.map(item => `(${item})`).join('|')
);

const enhance = compose(
  withRouter,
  connect((state: any, props: any) => ({
    currentAnalysis: state.analysis.saved.find(a => a.id === props.id),
  })),
  branch(
    ({ currentAnalysis }) => !currentAnalysis,
    ({ push }) => push({ pathname: '/analysis' })
  ),
  withProps(({ __type: { fields, name } }) => {
    const filteredFields = _.head(
      fields.filter(field => field.name === 'aggregations')
    ).type.fields;

    const clinicalAnalysisFields = filteredFields
      .filter(field => validClinicalTypesRegex.test(field.name))
      .filter(field => !blacklistRegex.test(field.name));
    return { clinicalAnalysisFields };
  })
);

const ClinicalAnalysisContainer = ({ clinicalAnalysisFields, ...props }) => {
  const CHART_HEIGHT = 295;
  const CHART_MARGINS = {
    top: 20,
    right: 50,
    bottom: 75,
    left: 55,
  };

  return (
    <QQPlot
      margin={CHART_MARGINS}
      yAxis={{ title: 'Bla' }}
      height={CHART_HEIGHT}
      styles={{ border: '1px solid lightgray', backgroundColor: 'pink' }}
    />
    // <ClinicalAnalysisResult
    //   clinicalAnalysisFields={clinicalAnalysisFields}
    //   {...props}
    // />
  );
};

export default enhance(ClinicalAnalysisContainer);
