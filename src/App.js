import React, { Component, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Home from "./components/home/home";
import Userprofile from "./components/user-profile/userProfile";
import Search from "./components/search/search";
import Fullimage from "./components/full-image/fullImage";
import Login from "./components/login/login";
import Singup from "./components/singup/singup";
import Notfound from "./components/not-found/notFound";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile/:username" component={Userprofile} />
          <Route path="/picture/:id" component={Fullimage} />
          <Route path="/login" component={Login} />
          <Route path="/singup" component={Singup} />
          <Route path="notFound" component={Notfound} />
          <Redirect to="/notFound" />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
