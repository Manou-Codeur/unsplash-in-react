import React, { useContext } from "react";
import { Link } from "react-router-dom";

import menuBar from "../../assets/img/menu.svg";
import searchIcon from "../../assets/img/search.svg";
import cameraIcon from "../../assets/img/camera.svg";
import "./headerHome.scss";

const Headerhome = ({
  askForMenu,
  handleSubscribeClick,
  handleSearchIconClick,
}) => {
  return (
    <div className="header-home">
      <nav>
        <div className="fake-div"></div>
        <p className="author">Made by Salim</p>
        <div className="links">
          <Link className="link" to="./login">
            Login
          </Link>
          <Link className="link" to="./singup">
            Singup
          </Link>
        </div>
      </nav>

      <div className="header-content">
        <img
          className="menu-icon"
          src={menuBar}
          alt="menu icon"
          onClick={askForMenu}
        />
        <div className="middle-content">
          <img src={cameraIcon} alt="camera icon" />
          <p className="logo-name">MYSPLASH</p>
          <p className="for-margin">
            Free high-resolution photos every 10 days
          </p>
          <button onClick={handleSubscribeClick}>Subscribe</button>
        </div>
        <img
          className="search-icon"
          src={searchIcon}
          alt="search icon"
          onClick={handleSearchIconClick}
        />
      </div>
    </div>
  );
};

export default Headerhome;
