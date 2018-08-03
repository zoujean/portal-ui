// @flow

import React from 'react';
import { compose, withState, branch, renderComponent } from 'recompose';
import Card from '@ncigdc/uikit/Card';
import Tabs from '@ncigdc/uikit/Tabs';
import CNAGraph from '@ncigdc/modern_components/CNAGraph';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { Row, Column } from '@ncigdc/uikit/Flex/';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { makeFilter } from '@ncigdc/utils/filters';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import { withTheme } from '@ncigdc/theme';
import createCaseSummary from '@ncigdc/modern_components/CaseSummary/CaseSummary.relay';
import ST from '@ncigdc/modern_components/SsmsTable';

const styles = {
  common: theme => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
};

const SsmsTable = createCaseSummary(
  ({
    viewer,
    node = viewer.repository.cases.hits.edges[0].node,
    projectId = node.project.project_id,
    ...props
  }) => (
    <ST
      {...props}
      contextFilters={makeFilter([
        { field: 'cases.project.project_id', value: projectId },
      ])}
      context={projectId}
      hideSurvival
    />
  ),
);

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>),
  ),
  withState('activeTab', 'setTab', 0),
  withTheme,
)(
  ({
    activeTab,
    setTab,
    theme,
    viewer: { repository: { cases: { hits: { edges } } } },
    active,
    state,
    setState,
    requests,
  }) => {
    const { case_id: caseId } = edges[0].node;
    // const caseFilter = makeFilter([
    //   { field: 'cases.case_id', value: [caseId] },
    // ]);
    const fmFilters = makeFilter([{ field: 'cases.case_id', value: caseId }]);

    const cna = null;
    return (
      <Card
        className=""
        style={{ flex: 1 }}
        title={
          <Row style={{ justifyContent: 'space-between' }}>
            <span>Most Frequent Mutations</span>
          </Row>
        }
      >
        <Tabs
          contentStyle={{ border: 'none' }}
          onTabClick={i => setTab(() => i)}
          tabs={[
            <p key="Somatic Mutations">Somatic Mutations</p>,
            <p key="Copy Number Alterations">Copy Number Alterations</p>,
          ]}
          activeIndex={activeTab}
        >
          {activeTab === 0 && (
            <div>
              <Column style={{ ...styles.card, marginTop: '2rem' }}>
                <Row
                  style={{
                    padding: '1rem 1rem 2rem',
                    // alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <ExploreLink
                    query={{ searchTableTab: 'mutations', filters: fmFilters }}
                  >
                    <GdcDataIcon /> Open in Exploration
                  </ExploreLink>
                </Row>
                <Column>
                  <SsmsTable caseId={caseId} defaultFilters={fmFilters} />
                </Column>
              </Column>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <CNAGraph caseId={caseId} />
              {cna && (
                <div
                  style={{
                    padding: '2px 10px 10px 10px',
                    borderTop: `1px solid ${theme.greyScale5}`,
                    marginTop: '10px',
                  }}
                >
                  <EntityPageHorizontalTable
                    title={'Copy Number Alterations'}
                    titleStyle={{ fontSize: '1em' }}
                    className="copy-number-variations-table"
                    data={[]}
                    headings={[
                      { key: 'gene', title: 'Gene' },
                      { key: 'cytoband', title: 'Cytoband' },
                      {
                        key: 'copy_number_variation',
                        title: 'Copy Number Variation',
                      },
                      {
                        key: 'affected_cases',
                        title: `# of Affected Cases Across ${edges[0].node
                          .project.project_id}`,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </Tabs>
      </Card>
    );
  },
);
