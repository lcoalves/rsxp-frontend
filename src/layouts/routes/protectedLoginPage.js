// import external modules
import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from "../../app/auth";

// import internal(own) modules
import FullPageLayout from "../fullpageLayout";

const ProtectedLoginPageLayoutRoute = ({ render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps =>
        isAuthenticated() ? (
          <Redirect
            to={{ pathname: "/inicio", state: { from: matchProps.location } }}
          />
        ) : (
          <FullPageLayout>{render(matchProps)}</FullPageLayout>
        )
      }
    />
  );
};

export default ProtectedLoginPageLayoutRoute;
