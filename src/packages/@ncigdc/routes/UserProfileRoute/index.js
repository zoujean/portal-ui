/* @flow */
import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const UserProfileRoute = (
  <Route
    path="/user-profile"
    component={LoadableWithLoading({
      loader: () => import('@ncigdc/routes/UserProfileRoute/UserProfileRoute'),
    })}
  />
);

export default UserProfileRoute;
