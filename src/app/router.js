// import external modules
import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import history from './history';
import Spinner from '../components/spinner/spinner';

// import internal(own) modules
import MainLayoutRoutes from '../layouts/routes/mainRoutes';
import ProtectedMainLayoutRoutes from '../layouts/routes/protectedMainRoutes';
import ProtectedLoginPage from '../layouts/routes/protectedLoginPage';
import ProtectedFullPageLayout from '../layouts/routes/protectedFullPageRoutes';
import FullPageLayout from '../layouts/routes/fullpageRoutes';
import ErrorLayoutRoute from '../layouts/routes/errorRoutes';

//UDF
const LazyGroups = lazy(() => import('../views/events/groups/index'));
const LazyGroupEdit = lazy(() => import('../views/events/groups/edit/index'));
const LazyLessonEdit = lazy(() =>
  import('../views/events/groups/edit/lesson/index')
);

const LazyGorupCreate = lazy(() =>
  import('../views/events/groups/create/index')
);

const LazyTrainings = lazy(() => import('../views/events/trainings/index'));
const LazySeminaries = lazy(() => import('../views/events/seminaries/index'));

const LazyOrders = lazy(() => import('../views/orders/index'));

const LazyUserProfile = lazy(() => import('../views/profile/index'));
const LazyHome = lazy(() => import('../views/home/index'));

// Opções para edição de grupos
const LazyCertificate = lazy(() => import('../views/certificate/index'));
const LazyNameTag = lazy(() => import('../views/nameTag/index'));
const LazyNameCard = lazy(() => import('../views/nameCard/index'));
// MUDAR DEPOIS PARA /VIEWS/EVENTS/SEMINARIES ***
const LazyGroupSeparation = lazy(() =>
  import('../views/events/groups/edit/groupSeparation/index')
);

// Main Layout
const LazyHorizontalTimeline = lazy(() =>
  import('../views/pages/horizontalTimeline')
);
const LazyVerticalTimeline = lazy(() =>
  import('../views/pages/verticalTimeline')
);
const LazyInvoice = lazy(() => import('../views/pages/invoice'));
const LazyGallery = lazy(() => import('../views/pages/gallery'));
const LazyFAQ = lazy(() => import('../views/pages/faq'));
const LazyKnowledgeBase = lazy(() => import('../views/pages/knowledgeBase'));
const LazySearch = lazy(() => import('../views/pages/search'));
const LazyBlankPage = lazy(() => import('../views/pages/blankPage'));
const LazyChangeLogPage = lazy(() => import('../views/pages/changeLogPage'));

// Full Layout
const LazySiteEvent = lazy(() => import('../views/pages/siteEvent'));
const LazyForgotPassword = lazy(() => import('../views/pages/forgotPassword'));
const LazyExpiredPassword = lazy(() =>
  import('../views/pages/expiredPassword')
);
const LazyResetPassword = lazy(() => import('../views/pages/resetPassword'));
const LazyLoginChoice = lazy(() => import('../views/pages/loginChoice'));
const LazyLoginChoicePF = lazy(() => import('../views/pages/loginChoicePF'));
const LazyLoginChoicePJ = lazy(() => import('../views/pages/loginChoicePJ'));
const LazyRegister = lazy(() => import('../views/pages/register'));
const LazyCheckoutItem = lazy(() =>
  import('../views/pages/checkout/checkoutItem')
);
const LazyCheckoutLogin = lazy(() =>
  import('../views/pages/checkout/checkoutLogin')
);
const LazyCheckoutPayment = lazy(() =>
  import('../views/pages/checkout/checkoutPayment')
);
const LazyMaintainance = lazy(() => import('../views/pages/maintainance'));
const LazyLockScreen = lazy(() => import('../views/pages/lockScreen'));

// Error Pages
const LazyErrorPage = lazy(() => import('../views/pages/error'));

class Router extends Component {
  render() {
    return (
      // Set the directory path if you are deplying in sub-folder
      <ConnectedRouter history={history}>
        <Switch>
          <ProtectedLoginPage
            exact
            path="/"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyLoginChoice {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedLoginPage
            exact
            path="/acesso-pf"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyLoginChoicePF {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedLoginPage
            exact
            path="/acesso-pj"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyLoginChoicePJ {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/inicio"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />

          {/* Eventos */}
          <ProtectedMainLayoutRoutes //GRUPOS
            exact
            path="/eventos/grupos"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyGroups {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes //GRUPOS EDITAR
            exact
            path="/eventos/grupo/:event_id/editar"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyGroupEdit {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/eventos/grupo/:event_id/editar/aula/:lesson_id"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyLessonEdit {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes //grupos
            exact
            path="/eventos/grupo/criar"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyGorupCreate {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/eventos/treinamentos"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyTrainings {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes //SEMINARIOS
            exact
            path="/eventos/seminarios"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazySeminaries {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/pedidos"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyOrders {...matchprops} />
              </Suspense>
            )}
          />

          {/* Saperate Pages Views */}
          <FullPageLayout
            exact
            path="/senha-expirada"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyExpiredPassword {...matchprops} />
              </Suspense>
            )}
          />

          <FullPageLayout
            exact
            path="/recuperar-senha"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyForgotPassword {...matchprops} />
              </Suspense>
            )}
          />

          <FullPageLayout
            exact
            path="/resetar-senha/:token"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyResetPassword {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/horizontal-timeline"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHorizontalTimeline {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/vertical-timeline"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyVerticalTimeline {...matchprops} />
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

          <ProtectedMainLayoutRoutes
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
            path="/lockscreen"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyLockScreen {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/invoice"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyInvoice {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/blank-page"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyBlankPage {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/change-log"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyChangeLogPage {...matchprops} />
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

          <ProtectedMainLayoutRoutes
            exact
            path="/gallery"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyGallery {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/faq"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyFAQ {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/knowledge-base"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyKnowledgeBase {...matchprops} />
              </Suspense>
            )}
          />

          <ProtectedMainLayoutRoutes
            exact
            path="/search"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazySearch {...matchprops} />
              </Suspense>
            )}
          />

          {/*-------------- Site dos eventos --------------*/}
          <FullPageLayout
            exact
            path="/evento/:event_id"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazySiteEvent {...matchprops} />
              </Suspense>
            )}
          />

          {/* Tela de escolha do item do checkout - inscrição em eventos */}
          <FullPageLayout
            exact
            path="/evento/:event_id/checkout/convite/:id"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCheckoutItem {...matchprops} />
              </Suspense>
            )}
          />
          <FullPageLayout
            exact
            path="/evento/:event_id/checkout"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCheckoutItem {...matchprops} />
              </Suspense>
            )}
          />

          {/* Tela de login do checkout - inscrição em eventos */}
          <FullPageLayout
            exact
            path="/evento/:event_id/checkout/login/convite/:id"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCheckoutLogin {...matchprops} />
              </Suspense>
            )}
          />
          <FullPageLayout
            exact
            path="/evento/:event_id/checkout/login"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCheckoutLogin {...matchprops} />
              </Suspense>
            )}
          />

          {/* Tela de pagamento do checkout - inscrição em eventos */}
          <FullPageLayout
            exact
            path="/evento/:event_id/checkout/pagamento/convite/:id"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCheckoutPayment {...matchprops} />
              </Suspense>
            )}
          />
          <FullPageLayout
            exact
            path="/evento/:event_id/checkout/pagamento"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCheckoutPayment {...matchprops} />
              </Suspense>
            )}
          />

          {/*-------------------- teste de certificados ------------------------*/}
          <ProtectedFullPageLayout
            exact
            path="/eventos/grupo/:event_id/certificados"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyCertificate {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedFullPageLayout
            exact
            path="/eventos/grupo/:event_id/crachas"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyNameTag {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedFullPageLayout
            exact
            path="/eventos/grupo/:event_id/cartoes"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyNameCard {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedMainLayoutRoutes
            exact
            path="/eventos/grupo/:event_id/organizacao-grupos"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyGroupSeparation {...matchprops} />
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

          {/* -------- TELAS ADMINISTRATIVAS ---------- */}
          <ProtectedMainLayoutRoutes
            exact
            path="/admin/eventos"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedMainLayoutRoutes
            exact
            path="/admin/licoes"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedMainLayoutRoutes
            exact
            path="/admin/ministerios"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedMainLayoutRoutes
            exact
            path="/admin/certificados"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedMainLayoutRoutes
            exact
            path="/admin/produtos"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
          <ProtectedMainLayoutRoutes
            exact
            path="/admin/kits"
            render={matchprops => (
              <Suspense fallback={<Spinner />}>
                <LazyHome {...matchprops} />
              </Suspense>
            )}
          />
        </Switch>
      </ConnectedRouter>
    );
  }
}

export default Router;
