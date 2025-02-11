// @flow

import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import {
  compose,
  lifecycle,
  pure,
  setDisplayName,
} from 'recompose';
import { isEqual } from 'lodash';

import Header from '@ncigdc/components/Header';
import AWGHeader from '@ncigdc/components/AWGHeader';
import Footer from '@ncigdc/components/Footer';
import NotificationContainer from '@ncigdc/components/NotificationContainer';
import RelayLoadingContainer from '@ncigdc/components/RelayLoadingContainer';
import ProgressContainer from '@ncigdc/components/ProgressContainer';
import ModalContainer from '@ncigdc/components/ModalContainer';
import Routes from '@ncigdc/routes';
import AWGRoutes from '@ncigdc/routes/AWGRoutes';
import withRouter from '@ncigdc/utils/withRouter';
import { GlobalTooltip } from '@ncigdc/uikit/Tooltip';
import styled from '@ncigdc/theme/styled';
import { setModal } from '@ncigdc/dux/modal';
import FirstTimeModal from '@ncigdc/components/Modals/FirstTimeModal';
import {
  AWG,
  FIRST_TIME_KEY,
} from '@ncigdc/utils/constants';

const SkipLink = styled.a({
  ':focus': ({ theme }) => ({
    color: theme.primary,
    left: 0,
    padding: '0.5rem',
    textDecoration: 'none',
  }),
  backgroundColor: '#fff',
  left: '-999px',
  position: 'absolute',
  zIndex: 1000,
});

const PortalContainer = ({
  notifications,
}: {
  notifications: Array<{ dismissed: string }>,
}) => (
  <div
    style={{
      minHeight: '100vh',
      minWidth: 1024,
      position: 'relative',
    }}
    >
    <SkipLink href="#skip">Skip to Main Content</SkipLink>
    <ProgressContainer />
    {AWG ? <AWGHeader /> : <Header />}
    <div
      id="skip"
      role="main"
      style={{
        paddingBottom: '120px',
        paddingTop: `calc(51px + ${notifications.filter(n => !n.dismissed)
          .length * 40}px)`,
        transition: 'padding 0.25s ease',
      }}
      >
      {AWG ? <AWGRoutes /> : <Routes />}
    </div>
    <Footer />
    <RelayLoadingContainer />
    <NotificationContainer />
    <ModalContainer />
    <GlobalTooltip />
  </div>
);

export default compose(
  setDisplayName('EnhancedPortalContainer'),
  withRouter,
  connect(store => ({ notifications: store.bannerNotification })),
  lifecycle({
    componentDidMount(): void {
      Cookies.get(FIRST_TIME_KEY) || this.props.dispatch(setModal(
        <FirstTimeModal
          onClose={() => {
            Cookies.set(FIRST_TIME_KEY, true);
          }}
          />,
        false,
      ));

      let lastPathname = this.props.location.pathname;
      this.removeListen = this.props.history.listen(location => {
        if (location.pathname !== lastPathname) {
          window.scrollTo(0, 0);
          lastPathname = location.pathname;
        }
      });
    },
    componentWillUnmount(): void {
      this.removeListen();
    },
    shouldComponentUpdate({
      location: nextLocation,
      notifications: nextNotifications,
    }) {
      const {
        location,
        notifications,
      } = this.props;

      return !(
        isEqual(nextLocation, location) &&
        isEqual(nextNotifications, notifications)
      );
    },
  }),
)(pure(PortalContainer));
