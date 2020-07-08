import React, { Component } from "react";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Picture from "./../../sub-components/picture/picture";

import "./home.scss";

class Home extends Component {
  state = {};
  render() {
    return (
      <div className="home">
        <Headerhome />
        {/* <Picture /> */}
      </div>
    );
  }
}

export default Home;
