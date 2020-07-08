import React from "react";
import { NavLink } from "react-router-dom";

import "./headerHome.scss";

const Headerhome = () => {
  return (
    <div className="header-home">
      <nav>
        <div className="inner-nav">
          <p className="author">Made by A.Salim</p>
          <div className="links">
            <NavLink className="link" activeClassName="activeLink" to="./login">
              Login
            </NavLink>
            <NavLink
              className="link"
              activeClassName="activeLink"
              to="./singup"
            >
              Singup
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Headerhome;
