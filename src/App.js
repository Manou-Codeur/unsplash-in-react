import React, { Component, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Home from "./components/home/home";
import Userprofile from "./components/user-profile/userProfile";
import Fullimage from "./components/full-image/fullImage";
import Login from "./components/login/login";
import Singup from "./components/singup/singup";
import Notfound from "./components/not-found/notFound";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/profile/:username" component={Userprofile} />
          <Route path="/picture/:id" component={Fullimage} />
          <Route
            path="/search"
            exact
            render={props => <Home {...props} search={true} />}
          />
          <Route
            path="/login"
            render={props => <Login {...props} pass="tetstt" />}
          />
          <Route path="/singup" component={Singup} />
          <Route
            path="/home"
            exact
            render={props => <Home {...props} search={false} />}
          />
          <Route path="/notFound" component={Notfound} />
          <Redirect from="/" exact to="/home" />
          <Redirect to="/notFound" />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
