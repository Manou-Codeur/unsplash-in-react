import React from "react";

import menuBar from "../../assets/img/menu.svg";
import searchIcon from "../../assets/img/search.svg";
import "./headerProfile.scss";

const HeaderProfile = ({ showMenu, showSearch }) => {
  return (
    <div className="header-profile">
      <div className="header-content">
        <img
          className="menu-icon"
          src={menuBar}
          alt="menu icon"
          onClick={showMenu}
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
          onClick={showSearch}
        />
      </div>
    </div>
  );
};

export default HeaderProfile;
