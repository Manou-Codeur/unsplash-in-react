import React, { Component } from "react";

import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";

import "./userProfile.scss";

class Userprofile extends Component {
  state = {
    menuAsked: false,
  };

  render() {
    return (
      <div className="user-profile">
        <HeaderProfile />
        <Menu />
      </div>
    );
  }
}

export default Userprofile;
