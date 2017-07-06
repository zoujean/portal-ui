// @flow

// Vendor
import React from 'react';
import { compose } from 'recompose';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import { connect } from 'react-redux';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import FileSizeIcon from 'react-icons/lib/fa/floppy-o';

// Custom
import formatFileSize from '@ncigdc/utils/formatFileSize';
import { getAuthCounts } from '@ncigdc/utils/auth';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import FilesTable from '@ncigdc/containers/FilesTable';
import MetadataDownloadButton from '@ncigdc/components/MetadataDownloadButton';
import SummaryCard from '@ncigdc/components/SummaryCard';
import HowToDownload from '@ncigdc/components/HowToDownload';
import CountCard from '@ncigdc/components/CountCard';
import CartDownloadDropdown from '@ncigdc/components/CartDownloadDropdown';
import RemoveFromCartButton from '@ncigdc/components/RemoveFromCartButton';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import SampleSize from '@ncigdc/components/SampleSize';

/*----------------------------------------------------------------------------*/

export type TProps = {
  files: Array<Object>,
  theme: Object,
  user: Object,
  viewer: {
    repository: {
      files: {
        aggregations: string,
        hits: string,
      },
    },
    summary: {
      aggregations: {
        fs: { value: number },
        project__project_id: {
          buckets: Array<{
            case_count: number,
            doc_count: number,
            file_size: number,
            key: string,
          }>,
        },
      },
    },
  },
};

type TCartPage = (props: TProps) => React.Element<*>;
const CartPage: TCartPage = ({ viewer, files, user, theme } = {}) => {
  const authCounts = getAuthCounts({ user, files });

  const styles = {
    container: {
      padding: '2rem 2.5rem 13rem',
    },
    header: {
      padding: '1rem',
      borderBottom: `1px solid ${theme.greyScale4}`,
      color: theme.primary,
    },
  };

  const caseCount = viewer.summary.aggregations.project__project_id.buckets.reduce(
    (sum, bucket) => sum + bucket.case_count,
    0,
  );

  const fileSize = viewer.summary.aggregations.fs.value;

  return (
    <Column style={styles.container}>
      {!files.length && <h1>Your cart is empty.</h1>}
      {!!files.length &&
        !!viewer.repository.files.hits &&
        <Column>
          <Row style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Column spacing="0.8rem" style={{ marginRight: '1rem' }}>
              <CountCard
                title="FILES"
                count={files.length}
                icon={<FileIcon style={{ width: '4rem', height: '4rem' }} />}
                style={{ backgroundColor: 'transparent' }}
              />
              <CountCard
                title="CASES"
                count={caseCount}
                icon={<CaseIcon style={{ width: '4rem', height: '4rem' }} />}
                style={{ backgroundColor: 'transparent' }}
              />
              <CountCard
                title="FILE SIZE"
                count={formatFileSize(fileSize)}
                icon={
                  <FileSizeIcon style={{ width: '4rem', height: '4rem' }} />
                }
                style={{ backgroundColor: 'transparent' }}
              />
            </Column>
            <SummaryCard
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                height: '19em',
                overflow: 'auto',
                minWidth: '30em',
                flexShrink: 0,
                marginLeft: '1rem',
                marginRight: '1rem',
              }}
              tableTitle="File Counts by Project"
              pieChartTitle="File Counts by Project"
              data={viewer.summary.aggregations.project__project_id.buckets.map(
                item => ({
                  project: item.key,
                  case_count: (
                    <div style={{ position: 'relative' }}>
                      {item.case_count}
                      <SparkMeterWithTooltip
                        part={item.case_count}
                        whole={caseCount}
                      />
                    </div>
                  ),
                  file_count: (
                    <div style={{ position: 'relative' }}>
                      {item.doc_count.toLocaleString()}
                      <SparkMeterWithTooltip
                        part={item.doc_count}
                        whole={files.length}
                      />
                    </div>
                  ),
                  file_count_meter: (
                    <SparkMeterWithTooltip
                      part={item.doc_count}
                      whole={files.length}
                    />
                  ),
                  file_size: (
                    <div style={{ position: 'relative' }}>
                      {formatFileSize(item.file_size)}
                      <SparkMeterWithTooltip
                        part={item.file_size}
                        whole={fileSize}
                      />
                    </div>
                  ),
                  file_size_meter: (
                    <SparkMeterWithTooltip
                      part={item.file_size}
                      whole={fileSize}
                    />
                  ),
                  tooltip: `${item.key}: ${item.doc_count.toLocaleString()}`,
                }),
              )}
              footer={`${viewer.summary.aggregations.project__project_id.buckets
                .length} Projects `}
              path="file_count"
              headings={[
                { key: 'project', title: 'Project', color: true },
                {
                  key: 'case_count',
                  title: <span>Cases<br /><SampleSize n={caseCount} /></span>,
                  style: { textAlign: 'right' },
                },
                {
                  key: 'file_count',
                  title: <span>Files<br /><SampleSize n={caseCount} /></span>,
                  style: { textAlign: 'right' },
                },

                {
                  key: 'file_size',
                  title: (
                    <span>
                      File Size<br />
                      <SampleSize
                        n={fileSize}
                        formatter={formatFileSize}
                        symbol="∑"
                      />
                    </span>
                  ),
                  style: { textAlign: 'right' },
                },
              ]}
            />
            <SummaryCard
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                height: '19em',
                overflow: 'auto',
                minWidth: '23em',
                flexShrink: 0,
                marginLeft: '1rem',
                marginRight: '1rem',
              }}
              tableTitle="File Counts by Authorization Level"
              pieChartTitle="File Counts by Authorization Level"
              data={authCounts.map(x => ({
                ...x,
                file_count_meter: (
                  <SparkMeterWithTooltip
                    part={x.doc_count}
                    whole={files.length}
                  />
                ),
                file_size: formatFileSize(x.file_size),
                file_size_meter: (
                  <SparkMeterWithTooltip part={x.file_size} whole={fileSize} />
                ),
                tooltip: `${x.key}: ${formatFileSize(x.file_size)}`,
              }))}
              footer={`${authCounts.length} Authorization Levels`}
              path="doc_count"
              headings={[
                {
                  key: 'key',
                  title: 'Level',
                  color: true,
                  tdStyle: { textTransform: 'capitalize' },
                },
                {
                  key: 'doc_count',
                  title: 'Files',
                  style: { textAlign: 'right' },
                },
                {
                  key: 'file_count_meter',
                  title: <SampleSize n={files.length} />,
                  thStyle: {
                    width: 1,
                    textAlign: 'center',
                  },
                  style: { textAlign: 'left' },
                },
                {
                  key: 'file_size',
                  title: 'File Size',
                  style: { textAlign: 'right' },
                },
                {
                  key: 'file_size_meter',
                  title: (
                    <SampleSize
                      n={fileSize}
                      formatter={formatFileSize}
                      symbol="∑"
                    />
                  ),
                  thStyle: {
                    width: 1,
                    textAlign: 'center',
                  },
                  style: { textAlign: 'left' },
                },
              ]}
            />
            <HowToDownload
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                minWidth: '18em',
                flexShrink: 0,
              }}
            />
          </Row>
          <Row style={{ marginBottom: '2rem' }}>
            <Row style={{ marginLeft: 'auto' }} spacing="1rem">
              <MetadataDownloadButton files={{ files }} />
              <CartDownloadDropdown files={files} user={user} />
              <RemoveFromCartButton />
            </Row>
          </Row>
          <FilesTable
            hits={viewer.repository.files.hits}
            downloadable={false}
            canAddToCart={false}
            tableHeader={'Cart Items'}
          />
        </Column>}
    </Column>
  );
};

export { CartPage };

export default createFragmentContainer(
  compose(
    connect(state => ({
      ...state.cart,
      ...state.auth,
    })),
    withTheme,
  )(CartPage),
  {
    /* TODO manually deal with:
  initialVariables: {
    files_offset: null,
    files_size: null,
    filters: null,
    files_sort: null,
  }
  */
    viewer: graphql`
    fragment CartPage_viewer on Root {
      summary: cart_summary {
        aggregations(filters: $filters) {
          project__project_id {
            buckets {
              case_count
              doc_count
              file_size
              key
            }
          }
          fs { value }
        }
      }
      repository {
        files {
          hits(first: $files_size offset: $files_offset, sort: $files_sort filters: $filters) {
            ...FilesTable_hits
          }
        }
      }
    }
  `,
  },
);
