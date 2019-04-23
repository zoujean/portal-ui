import React from 'react';
import ClinicalAnalysisResult from '@ncigdc/modern_components/ClinicalAnalysis';
import { compose, withProps, branch } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import { connect } from 'react-redux';
import QQPlot from '@ncigdc/components/QQPlot';
import _ from 'lodash';

import { Column } from '@ncigdc/uikit/Flex';
import {
  ChickWeight,
  DNase,
  indoTime,
  lakeHuron,
  insectSprays,
  nile,
  ozone,
  solarRadiation,
  wwwUsage,
  orchardSprays,
} from '@ncigdc/components/qq_test_data';
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
    <Column>
      <QQPlot
        data={ChickWeight}
        margin={CHART_MARGINS}
        yAxis={{ title: 'ChickWeight' }}
        title={'ChickWeight'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={DNase}
        margin={CHART_MARGINS}
        yAxis={{ title: 'DNase' }}
        title={'DNase'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={insectSprays}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Insect Sprays'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={indoTime}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Pharmacokinetics of Indomethacin'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={lakeHuron}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Lake Huron'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={nile}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Nile Flow'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={wwwUsage}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Internet Usage'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={orchardSprays}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Orchard Sprays'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={ozone}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Ozone (filtered for N/A values)'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={solarRadiation}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Solar Radiation (filtered for N/A values)'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
    </Column>

    // <ClinicalAnalysisResult
    //   clinicalAnalysisFields={clinicalAnalysisFields}
    //   {...props}
    // />
  );
};

export default enhance(ClinicalAnalysisContainer);
