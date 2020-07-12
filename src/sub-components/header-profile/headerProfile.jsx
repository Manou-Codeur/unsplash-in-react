import React, { useContext } from "react";

import Context from "./../../services/contextApi";

import menuBar from "../../assets/img/menu.svg";
import searchIcon from "../../assets/img/search.svg";
import "./headerProfile.scss";

const HeaderProfile = props => {
  const myContext = useContext(Context);

  return (
    <div className="header-profile">
      <div className="header-content">
        <img
          className="menu-icon"
          src={menuBar}
          alt="menu icon"
          //   onClick={myContext.askForMenu}
        />

        <div className="middle-content">
          <div className="user-picture"></div>
          <p className="user-name">Ayache Salim</p>
          <p className="user-website">www.mariophtography.com</p>
          <div className="links">
            <p>Photos</p>
            <p>Liked</p>
            <p>Collections</p>
          </div>
        </div>

        <img
          className="search-icon"
          src={searchIcon}
          alt="search icon"
          //   onClick={myContext.handleSearchIconClick}
        />
      </div>
    </div>
  );
};

export default HeaderProfile;
