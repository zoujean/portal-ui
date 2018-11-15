/* @flow */

import { saveAs } from 'filesaver.js';
import { handleActions } from 'redux-actions';
import { fetchAuth } from '@ncigdc/utils/ajax';
import { FAKE_USER, IS_DEV, AWG } from '@ncigdc/utils/constants';
export type State = { isFetching: boolean, user: ?Object, error?: Object };
export type Action = { type: string, payload: any };

const USER_REQUEST = 'gdc/USER_REQUEST';
const USER_SUCCESS = 'gdc/USER_SUCCESS';
const USER_FAILURE = 'gdc/USER_FAILURE';

const TOKEN_REQUEST = 'gdc/TOKEN_REQUEST';
const TOKEN_SUCCESS = 'gdc/TOKEN_SUCCESS';
const TOKEN_FAILURE = 'gdc/TOKEN_FAILURE';
const TOKEN_CLEAR = 'gdc/TOKEN_CLEAR';

const SET_USER_ACCESS = 'gdc/SET_USER_ACCESS';

export function fetchUser() {
  if (IS_DEV) {
    return {
      type: USER_SUCCESS,
      payload: FAKE_USER,
    };
  }

  return fetchAuth({
    types: [
      USER_REQUEST,
      {
        type: USER_SUCCESS,
        payload: async (action, state, res) => {
          const text = await res.text();
          const json = JSON.parse(text);
          return json;
        },
      },
      USER_FAILURE,
    ],
    endpoint: 'user',
  });
}

export function forceLogout(): Action {
  return {
    type: USER_FAILURE,
    payload: { message: 'Session timed out or not authorized' },
  };
}

export function clearToken(): Action {
  return {
    type: TOKEN_CLEAR,
    payload: {},
  };
}

export function fetchToken() {
  return fetchAuth({
    types: [
      TOKEN_REQUEST,
      {
        type: TOKEN_SUCCESS,
        payload: async (action, state, res) => {
          const token = await res.text();

          saveAs(
            new Blob([token], { type: 'text/plain;charset=us-ascii' }),
            `gdc-user-token.${new Date().toISOString()}.txt`,
          );

          return token;
        },
      },
      TOKEN_FAILURE,
    ],
    endpoint: AWG ? 'token/refresh/awg' : 'token/refresh',
  });
}

export function setUserAccess(access): Action {
  console.log('setting user access: ', access);
  return {
    type: SET_USER_ACCESS,
    payload: access,
  };
}

const initialState: State = {
  firstLoad: true,
  isFetching: false,
  user: null,
  error: {},
  isFetchingToken: false,
  token: undefined,
  failed: false,
  intersection: null,
  fence_projects: null,
  nih_projects: null,
  accessSet: false,
};

export default handleActions(
  {
    [USER_REQUEST]: state => ({
      ...state,
      isFetching: true,
      user: null,
      error: {},
    }),
    [USER_SUCCESS]: (state, action) => ({
      ...state,
      isFetching: false,
      user: action.error ? null : action.payload,
      error: action.error ? action.payload : {},
      firstLoad: false,
      failed: false,
    }),
    [USER_FAILURE]: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload,
      user: null,
      firstLoad: false,
      failed: true,
      intersection: null,
      fence_projects: null,
      nih_projects: null,
    }),
    [TOKEN_REQUEST]: state => ({
      ...state,
      isFetchingToken: true,
    }),
    [TOKEN_SUCCESS]: (state, action) => ({
      ...state,
      isFetchingToken: false,
      token: action.payload,
    }),
    [TOKEN_FAILURE]: state => ({
      ...state,
      isFetchingToken: false,
      token: undefined,
    }),
    [TOKEN_CLEAR]: state => ({
      ...state,
      isFetchingToken: false,
      token: undefined,
    }),
    [SET_USER_ACCESS]: (state, action) => ({
      ...state,
      intersection: action.payload.intersection,
      fence_projects: action.payload.fence_projects,
      nih_projects: action.payload.nih_projects,
      accessSet: action.payload.accessSet,
    }),
  },
  initialState,
);
