import React, { useContext } from "react";

import Context from "./../../services/contextApi";

import "./menu.scss";
import closeIcon from "../../assets/img/close.svg";
import instaIcon from "../../assets/img/instagram.png";
import facebookIcon from "../../assets/img/facebook.png";
import twitterIcon from "../../assets/img/twitter.png";
import pinIcon from "../../assets/img/pinterest.png";

const Menu = ({ menuAsked }) => {
  const menuContext = useContext(Context);

  return (
    <div className="menu" style={!menuAsked ? { display: "none" } : null}>
      <div className="close-containner">
        <img
          className="close-icon"
          src={closeIcon}
          alt="close icon"
          onClick={menuContext.closeMenu}
        />
      </div>

      <div className="user-profile">
        <div className="pp"></div>
        <div className="user-info">
          <h4>Ayache Salim</h4>
          <p>logout</p>
        </div>
      </div>

      <div className="browse-section">
        <p className="head">Browse</p>

        <p>Featured</p>
        <p>Popular</p>
        <p>New</p>
        <p>Collections</p>
      </div>

      <div className="explore-section">
        <p className="head">Explore</p>

        <p>Made With Unsplash</p>
        <p>Tag Photos</p>
        <p>Developers</p>
        <p>Backstage</p>
        <p>Submit a photo</p>
      </div>

      <div className="social-media">
        <img className="social-icon" src={instaIcon} alt="Instagam" />
        <img className="social-icon" src={facebookIcon} alt="Facebook" />
        <img className="social-icon" src={pinIcon} alt="pinterest" />
        <img className="social-icon" src={twitterIcon} alt="Twitter" />
      </div>
    </div>
  );
};

export default Menu;
