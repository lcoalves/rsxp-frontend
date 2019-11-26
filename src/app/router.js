// import external modules
import React, { Component, Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import history from './history';
import Spinner from '../components/spinner/spinner';

// import internal(own) modules
import MainLayoutRoutes from '../layouts/routes/mainRoutes';
import ProtectedMainLayoutRoutes from '../layouts/routes/protectedMainRoutes';
import ProtectedLoginPage from '../layouts/routes/protectedLoginPage';
import FullPageLayout from '../layouts/routes/fullpageRoutes';
import ErrorLayoutRoute from '../layouts/routes/errorRoutes';

const LazyUserProfile = lazy(() => import('../views/profile/index'));
const LazyHome = lazy(() => import('../views/home/index'));

// Full Layout
const LazyForgotPassword = lazy(() => import('../views/pages/forgotPassword'));
const LazyResetPassword = lazy(() =>
  import('../views/pages/forgotPasswordConfirmation')
);
const LazyLoginChoicePF = lazy(() => import('../views/pages/loginChoicePF'));
const LazyRegister = lazy(() => import('../views/pages/register'));

const LazyMaintainance = lazy(() => import('../views/pages/maintainance'));

// Error Pages
const LazyErrorPage = lazy(() => import('../views/pages/error'));

class Router extends Component {
  state = {};

  render() {
    return (
      // Set the directory path if you are deplying in sub-folder
      <ConnectedRouter history={history}>
        <Switch>
          {/* <ProtectedLoginPage
            exact
            path="/"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyLoginChoicePF {...matchprops} />
              </Suspense>
            )}
          /> */}

          <MainLayoutRoutes
            exact
            path="/inicio"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />

          <FullPageLayout
            exact
            path="/recuperar-senha-pf"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyForgotPassword {...matchprops} />
              </Suspense>
            )}
          />

          <FullPageLayout
            exact
            path="/resetar-senha-pf/:token"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyResetPassword {...matchprops} />
              </Suspense>
            )}
          />

          <FullPageLayout
            exact
            path="/cadastro"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyRegister {...matchprops} />
              </Suspense>
            )}
          />

          <MainLayoutRoutes
            exact
            path="/perfil"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyUserProfile {...matchprops} />
              </Suspense>
            )}
          />

          <FullPageLayout
            exact
            path="/maintenance"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyMaintainance {...matchprops} />
              </Suspense>
            )}
          />

          <ErrorLayoutRoute
            exact
            path="/error"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyErrorPage {...matchprops} />
              </Suspense>
            )}
          />

          <ErrorLayoutRoute
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyErrorPage {...matchprops} />
              </Suspense>
            )}
          />
        </Switch>
      </ConnectedRouter>
    );
  }
}

export default Router;
