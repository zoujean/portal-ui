import React from 'react';
import ClinicalAnalysisResult from '@ncigdc/modern_components/ClinicalAnalysis';
import { compose, withProps, branch } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import { connect } from 'react-redux';
import QQPlot from '@ncigdc/modern_components/QQPlot';
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

  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };
  const generateValues = (n, max) => _.times(n, () => getRandomInt(max));

  return (
    <Column>
      {/* <QQPlot
        data={generateValues(100000, 10000)}
        margin={CHART_MARGINS}
        yAxis={{ title: 'random' }}
        title={'100,000 random values'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      /> */}
      <QQPlot
        data={[]}
        margin={CHART_MARGINS}
        yAxis={{ title: 'Age at Diagnosis' }}
        title={'Age at Diagnosis'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
        realData
      />
      <QQPlot
        data={ChickWeight}
        margin={CHART_MARGINS}
        yAxis={{ title: 'ChickWeight$weight' }}
        title={'ChickWeight$weight'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={DNase}
        margin={CHART_MARGINS}
        yAxis={{ title: 'DNase$conc' }}
        title={'DNase'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={insectSprays}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'InsectSprays$count'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={indoTime}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Indometh$time'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={lakeHuron}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'LakeHuron'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={nile}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'Nile'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={wwwUsage}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'WWWusage'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={orchardSprays}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'OrchardSprays$decrease'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={ozone}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'airquality$Ozone'}
        height={CHART_HEIGHT}
        styles={{ border: '1px solid lightgray' }}
      />
      <QQPlot
        data={solarRadiation}
        margin={CHART_MARGINS}
        yAxis={{ title: '' }}
        title={'airquality$Solar.R'}
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
