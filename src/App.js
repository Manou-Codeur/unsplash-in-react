import React, { useEffect, Fragment, useState, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

import FirebaseContext from "./services/firebase/firebaseContext";
import Home from "./components/home/home";
import Userprofile from "./components/user-profile/userProfile";
import Fullimage from "./components/full-image/fullImage";
import Login from "./components/login/login";
import Singup from "./components/singup/singup";
import Notfound from "./components/not-found/notFound";

const App = props => {
  console.log("app--render");
  const [userAuth, setUserAuth] = useState(null);
  const [wait, setWait] = useState(true);

  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    firebase.isUserAuthenticated(userInfo => {
      setUserAuth(userInfo);
      setWait(false);
    });
  }, []);

  if (wait)
    return (
      <div className="full-pic-loading">
        <CircularProgress color="inherit" />
      </div>
    );
  return (
    <Fragment>
      <Switch>
        <Route
          path="/profile/:username"
          render={props =>
            userAuth ? (
              <Userprofile {...props} userAuth={userAuth} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location.pathname },
                }}
              />
            )
          }
        />

        <Route
          path="/picture/:id"
          render={props =>
            userAuth ? (
              <Fullimage {...props} userAuth={userAuth} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location.pathname },
                }}
              />
            )
          }
        />

        <Route
          path="/login"
          render={props => <Login {...props} userAuth={userAuth} />}
        />

        <Route path="/singup" render={props => <Singup {...props} />} />

        <Route path="/home" exact component={Home} />

        <Route path="/notFound" component={Notfound} />

        <Redirect from="/" exact to="/home" />

        <Redirect to="/notFound" />
      </Switch>
    </Fragment>
  );
};

export default App;
