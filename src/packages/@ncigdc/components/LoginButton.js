// @flow
/* eslint no-restricted-globals: 0 */

import React from 'react';
import { connect } from 'react-redux';
import LoginIcon from 'react-icons/lib/fa/sign-in';
import { fetchUser } from '@ncigdc/dux/auth';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import styled from '@ncigdc/theme/styled';
import { AUTH, FENCE } from '@ncigdc/utils/constants';

/*----------------------------------------------------------------------------*/

let first = true;

const openAuthWindow = ({
  pathname,
  dispatch,
  push,
  user,
  pollInterval = 600,
  winUrl = `${AUTH}?next=${location.origin}`,
  winStyle = 'width=800, height=600',
}) => {
  if (navigator.cookieEnabled) {
    const win = open(winUrl, 'Auth', winStyle);
    window.loginPopup = win;
    console.log('is first, top? ', first, 'win: ', win);
    const interval = setInterval(() => {
      console.log('setting interval');
      try {
        console.log('try clause');
        // Because the login window redirects to a different domain, checking
        // win.document in IE11 throws exceptions right away, which prevents
        // #clearInterval from ever getting called in this block.
        // Must check this block (if the login window has been closed) first!
        if (win.closed) {
          console.log('window closed: ', win, 'first: ', first);
          clearInterval(interval);
        } else if (
          win.document.URL.includes(location.origin) &&
          !win.document.URL.includes('auth')
        ) {
          console.log('window should be closing', win, ' first: ', first);
          win.close();
          console.log('window is closed');
          setTimeout(() => {
            console.log('setting first timeout: ', interval);
            clearInterval(interval);
            setTimeout(() => {
              console.log('setting second timeout', interval);
              // fetch authpublic user
              if (first) {
                console.log('is first: ', first);
                first = false;
                console.log('fetching user from authpublic');
                dispatch(fetchUser());
                console.log('user: ', user);
                // login with fence
                console.log('open auth window for fence');
                openAuthWindow({
                  pathname,
                  dispatch,
                  user,
                  push,
                  pollInterval: 500,
                  winUrl: `${FENCE}/login/shib?redirect=${location.origin}`,
                  winStyle:
                    'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=50000, top=50000, width=1, height=1, visible=none',
                });
              } else {
                push('/repository');
              }
            }, pollInterval);
          }, pollInterval);
        }
      } catch (err) {
        // console.log('Error while monitoring the Login window: ', err);
      }
    }, pollInterval);
  } else {
    console.log('need to allow cookies');
    // show cookie needs to be enabled message
  }
};

const Link = styled.a({
  textDecoration: 'none',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
});

const styles = {
  marginLeft: {
    marginLeft: '0.7rem',
  },
};

const LoginButton = ({ children, dispatch, user }) => (
  <LocationSubscriber>
    {({ pathname, push }) => (
      <Link
        className="test-login-button"
        onClick={() =>
          openAuthWindow({ pathname, dispatch, push, user, pollInterval: 200 })}
      >
        {children || (
          <span>
            <LoginIcon />
            <span
              className="header-hidden-sm header-hidden-md"
              style={styles.marginLeft}
            >
              Login
            </span>
          </span>
        )}
      </Link>
    )}
  </LocationSubscriber>
);

/*----------------------------------------------------------------------------*/

export default connect(state => state.auth)(LoginButton);
