// @flow
import React from 'react';
import { take, xor, omit } from 'lodash';
import Undo from 'react-icons/lib/md/undo';
import LeftArrow from 'react-icons/lib/fa/long-arrow-left';
import Cogs from 'react-icons/lib/fa/cogs';
import Color from 'color';
import {
  compose,
  withState,
  pure,
  withHandlers,
  withPropsOnChange,
  withProps,
} from 'recompose';

import { humanify } from '@ncigdc/utils/string';
import withRouter from '@ncigdc/utils/withRouter';

import Button, { buttonBaseStyles } from '@ncigdc/uikit/Button';
import { Row } from '@ncigdc/uikit/Flex';
import Info from '@ncigdc/uikit/Info';

import styled from '@ncigdc/theme/styled';
import { buttonLike } from '@ncigdc/theme/mixins';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import Link from '@ncigdc/components/Links/Link';

import { facetFieldDisplayMapper } from '@ncigdc/components/Aggregations';
import GeneSymbol from '@ncigdc/modern_components/GeneSymbol';
import SetId from '@ncigdc/components/SetId';
import { parseJSONParam } from '@ncigdc/utils/uri/index';
import { AWG } from '@ncigdc/utils/constants';

/*----------------------------------------------------------------------------*/

const Field = styled(Button, {
  ':hover': {
    backgroundColor: ({ theme }) => Color(theme.greyScale2)
      .lighten(0.7)
      .rgbString(),
  },
  backgroundColor: ({ theme }) => theme.greyScale2,
});

const Value = styled(Button, {
  ':hover': {
    backgroundColor: ({ theme }) => Color(theme.success)
      .lighten(0.7)
      .rgbString(),
  },
  backgroundColor: ({ theme }) => theme.success,
});

const Op = styled.span({
  ...buttonLike,
  backgroundColor: ({ theme }) => theme.primary,
  color: 'white',
});

const NotUnderlinedLink = styled(Link, {
  ':link': {
    textDecoration: 'none',
  },
});

const LinkButton = styled(Link, {
  ...buttonBaseStyles,
  ':link': {
    color: buttonBaseStyles.color,
    textDecoration: 'none',
  },
  flex: 'none',
});

type TProps = {
  query: Object,
  currentFilters: Array<Object>,
  onLessClicked: Function,
  isFilterExpanded: Function,
  style: Object,
  linkPathname?: string,
  linkText?: string,
  linkFieldMap?: Function,
  hideLinkOnEmpty: boolean,
  getDisplayValue: Function,
  hideHelpText?: boolean,
  hideClearButton?: boolean,
};

export const getDisplayOp = (op: string, value: Array<string>) => {
  if (op.toLowerCase() === 'in') {
    if (value.length === 1) {
      if (typeof value[0] === 'string' && value[0].includes('set_id')) {
        return 'IN';
      }
      return 'IS';
    }
    return 'IN';
  }
  return op;
};

const enhance = compose(
  withRouter,
  withPropsOnChange(['query'], ({ query: { filters } }) => ({
    filters: parseJSONParam(filters),
  })),
  withPropsOnChange(['filters'], ({ filters }) => ({
    currentFilters: (filters && filters.content) || [],
  })),
  withState('expandedFilters', 'setExpandedFilters', []),
  withProps(({ expandedFilters }) => ({
    isFilterExpanded: filter => expandedFilters.includes(filter),
  })),
  withProps(() => ({
    getDisplayValue: (field, value) => {
      switch (typeof value) {
        case 'string':
          if (value.includes('set_id:')) {
            return <SetId set={value} />;
          }
          if (field === 'genes.gene_id') {
            return <GeneSymbol geneId={value} />;
          }
          return value;
        case 'boolean':
          return value ? 'true' : 'false';
        case 'number':
          return value;
        default:
          return value;
      }
    },
  })),
  withHandlers({
    onLessClicked: ({ expandedFilters, setExpandedFilters }) => filter => {
      setExpandedFilters(xor(expandedFilters, [filter]));
    },
  }),
  pure,
);

const styles = {
  groupPadding: {
    padding: '0.5rem 0',
  },
  leftParen: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '2rem',
    marginRight: '0.3rem',
  },
  rightParen: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '2rem',
    marginRight: '0.3rem',
  },

};

const CurrentFilters = (
  {
    query,
    currentFilters,
    onLessClicked,
    isFilterExpanded,
    style,
    linkPathname,
    linkText,
    linkFieldMap = f => f,
    hideLinkOnEmpty = true,
    getDisplayValue,
    hideHelpText = false,
    hideClearButton = false,
  }: TProps = {},
) => (
  <Info className="test-current-filters" style={style}>
    {!currentFilters.length &&
      !hideHelpText && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            lineHeight: '44px',
            width: '100%',
          }}
          >
          <LeftArrow />
          <span style={{ marginLeft: '0.6rem' }}>
            Start searching by selecting a facet
          </span>
        </span>
    )}
    {!!currentFilters.length && (
      <Row
        style={{
          justifyContent: 'space-between',
          width: '100%',
        }}
        >
        <Row spacing="0.3rem" wrap>
          {!hideClearButton && (
            <NotUnderlinedLink
              className="test-clear"
              query={omit(query, 'filters')}
              style={styles.groupPadding}
              >
              <Button leftIcon={<Undo />}>Clear</Button>
            </NotUnderlinedLink>
          )}

          {currentFilters.map((filter, i) => {
            const value = [].concat(filter.content.value || []);

            return (
              <Row
                key={`${filter.content.field}.${filter.op}.${value.join()}`}
                spacing="0.3rem"
                style={styles.groupPadding}
                >
                <NotUnderlinedLink
                  className="test-field-name"
                  merge="toggle"
                  query={{
                    filters: {
                      content: [filter],
                      op: 'and',
                    },
                    offset: 0,
                  }}
                  >
                  <Field>
                    {humanify({ term: facetFieldDisplayMapper(filter.content.field) })}
                  </Field>
                </NotUnderlinedLink>
                <Op>{getDisplayOp(filter.op, value)}</Op>
                {value.length > 1 && <span style={styles.leftParen}>(</span>}
                {(isFilterExpanded(filter)
                  ? value
                  : take(value, 2)
                ).map(value => (
                  <NotUnderlinedLink
                    className="test-field-value"
                    key={value}
                    merge="toggle"
                    query={{
                      filters: {
                        content: [
                          {
                            content: {
                              field: filter.content.field,
                              value: [value],
                            },
                            op: filter.op,
                          },
                        ],
                        op: 'and',
                      },
                      offset: 0,
                    }}
                    >
                    <Value>
                      {getDisplayValue(filter.content.field, value)}
                    </Value>
                  </NotUnderlinedLink>
                ))}
                {value.length > 2 && (
                  <UnstyledButton
                    className="test-toggle"
                    onClick={() => onLessClicked(filter)}
                    style={styles.rightParen}
                    >
                    …
                  </UnstyledButton>
                )}
                {isFilterExpanded(filter) && (
                  <UnstyledButton
                    className="test-toggle"
                    onClick={() => onLessClicked(filter)}
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                    >
                    Less
                  </UnstyledButton>
                )}
                {value.length > 1 && <span style={styles.rightParen}>)</span>}
                {i < currentFilters.length - 1 && <Op>AND</Op>}
              </Row>
            );
          })}
        </Row>
      </Row>
    )}
    {!AWG &&
      linkPathname &&
      (!hideLinkOnEmpty || !!currentFilters.length) && (
        <LinkButton
          pathname={linkPathname}
          query={
            currentFilters.length && {
              filters: {
                content: currentFilters.map(
                  ({ content: { field, value }, op }) => ({
                    content: {
                      field: linkFieldMap(field),
                      value,
                    },
                    op: op.toLowerCase(),
                  }),
                ),
                op: 'and',
              },
            }
          }
          >
          <Cogs style={{ marginRight: 5 }} />
          {linkText}
        </LinkButton>
    )}
  </Info>
);
/*----------------------------------------------------------------------------*/

export default enhance(CurrentFilters);
