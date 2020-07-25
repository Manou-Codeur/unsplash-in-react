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
    return (
      <Fragment>
        <Switch>
          <Route
            path="/profile/:username"
            render={props =>
              this.state.userAuth ? (
                <Userprofile {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/picture/:id"
            render={props =>
              this.state.userAuth ? (
                <Fullimage {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/search"
            render={props => <Home {...props} search={true} />}
          />
          <Route path="/login" component={Login} />
          <Route path="/singup" component={Singup} />
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
