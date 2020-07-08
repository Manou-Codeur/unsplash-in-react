import React from "react";
import { Link } from "react-router-dom";

import menuBar from "../../assets/img/menu.svg";
import searchIcon from "../../assets/img/search.svg";
import cameraIcon from "../../assets/img/camera.svg";
import "./headerHome.scss";

const Headerhome = () => {
  return (
    <div className="header-home">
      <nav>
        <div className="fake-div"></div>
        <p className="author">Made by A.Salim</p>
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
        <img className="menu" src={menuBar} alt="menu icon" />
        <div className="middle-content">
          <img src={cameraIcon} alt="camera icon" />
          <p className="logo-name">UNSPLASH</p>
          <p className="for-margin">
            Free high-resolution photos every 10 days
          </p>
          <button>Subscribe</button>
        </div>
        <img className="search" src={searchIcon} alt="search icon" />
      </div>
    </div>
  );
};

export default Headerhome;
