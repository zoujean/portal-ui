/* @flow */
import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { Row } from '@ncigdc/uikit/Flex';
import Hidden from '@ncigdc/components/Hidden';
import Heading from '@ncigdc/uikit/Heading';
import Table, { Tr, Th, Td } from '@ncigdc/uikit/Table';
import Check from '@ncigdc/theme/icons/Check';

const enhance = compose(
  connect(({ auth: { user } }) => ({ user })),
  branch(({ user }) => !user, renderComponent(() => <Redirect to="/" />)),
);

const UserProfilePage = ({ user: { username, projects } }) => {
  const flattenedProjects = Object.keys(projects).reduce(
    (acc, k) => ({ ...acc, ...projects[k] }),
    {},
  );
  const allValues = [
    ...new Set(
      Object.keys(flattenedProjects).reduce(
        (acc, projectId) => [...acc, ...flattenedProjects[projectId]],
        [],
      ),
    ),
  ];
  return (
    <div style={{ padding: '2rem 2.5rem 13rem' }}>
      <Row>
        <Heading>
          Username: {username}
        </Heading>
      </Row>
      <Row style={{ justifyContent: 'center' }}>
        <Table
          className="test-user-profile-table"
          headings={[
            'Project ID',
            ...allValues.map(v => <Th style={{ textAlign: 'center' }}>{v}</Th>),
          ]}
          style={{ width: '90%' }}
          body={
            <tbody>
              {Object.keys(flattenedProjects).map((projectId, i) =>
                <Tr key={projectId} index={i}>
                  <Td key={`${i}-project-id`}>{projectId}</Td>
                  {allValues.map(v =>
                    <Td key={`${i}-${v}`} style={{ textAlign: 'center' }}>
                      {flattenedProjects[projectId].includes(v)
                        ? <span><Check /><Hidden>True</Hidden></span>
                        : <span><Hidden>False</Hidden></span>}
                    </Td>,
                  )}
                </Tr>,
              )}
            </tbody>
          }
        />
      </Row>
    </div>
  );
};

export default enhance(UserProfilePage);
