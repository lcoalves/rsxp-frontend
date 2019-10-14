// import external modules
import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from "../../app/auth";

// import internal(own) modules
import FullPageLayout from "../fullpageLayout";

const ProtectedFullPageLayoutRoute = ({ render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps =>
        isAuthenticated() ? (
          <FullPageLayout>{render(matchProps)}</FullPageLayout>
        ) : (
          <Redirect
            to={{ pathname: "/inicio", state: { from: matchProps.location } }}
          />
        )
      }
    />
  );
};

export default ProtectedFullPageLayoutRoute;
