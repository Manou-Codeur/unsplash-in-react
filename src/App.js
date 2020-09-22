import React, { Component, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import FirebaseContext from "./services/firebase/firebaseContext";

import Home from "./components/home/home";
import Userprofile from "./components/user-profile/userProfile";
import Fullimage from "./components/full-image/fullImage";
import Login from "./components/login/login";
import Singup from "./components/singup/singup";
import Notfound from "./components/not-found/notFound";

class App extends Component {
  state = {
    userAuth: null,
  };

  static contextType = FirebaseContext;

  componentDidMount() {
    this.context.isUserAuthenticated(userInfo => {
      this.setState({ userAuth: userInfo });
    });
  }

  render() {
    const { userAuth } = this.state;

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
            path="/search"
            render={props => <Home {...props} search={true} />}
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
  }
}

export default App;
