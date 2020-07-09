import React, { Component } from "react";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";
import Context from "./../../services/contextApi";

import "./home.scss";

class Home extends Component {
  state = {
    menuAsked: false,
  };

  askForMenu = () => {
    this.setState({ menuAsked: !this.state.menuAsked });
  };

  closeMenu = () => {
    this.setState({ menuAsked: false });
  };

  render() {
    return (
      <div className="home">
        <Context.Provider
          value={{ askForMenu: this.askForMenu, closeMenu: this.closeMenu }}
        >
          <Headerhome />
          <div className="picture-grid">
            <Picture />
            <Picture />
            <Picture />
            <Picture />
          </div>
          <Menu menuAsked={this.state.menuAsked} />
        </Context.Provider>
      </div>
    );
  }
}

export default Home;
