import React from "react";

import "./menu.scss";
import closeIcon from "../../assets/img/close.svg";
import instaIcon from "../../assets/img/instagram.png";
import facebookIcon from "../../assets/img/facebook.png";
import twitterIcon from "../../assets/img/twitter.png";
import pinIcon from "../../assets/img/pinterest.png";

const Menu = React.memo(
  ({ menuAsked, closeMenu, authUser, singoutORsingin }) => {
    console.log("menu--render");

    const hideMenuOnClick = ({ target }) => {
      target.style.left = "-200%";
      closeMenu();
    };

    return (
      <div
        className="menu-containner"
        style={!menuAsked ? { left: "-200%" } : { left: "0" }}
        onClick={hideMenuOnClick}
      >
        <div className="menu">
          <div className="close-containner">
            <img
              className="close-icon"
              src={closeIcon}
              alt="close icon"
              onClick={closeMenu}
            />
          </div>

          <div className="user-profile">
            <div
              className="pp"
              style={
                authUser && authUser.photoURL
                  ? {
                      background: `url("${authUser.photoURL}")`,
                      backgroundSize: "cover",
                    }
                  : null
              }
            ></div>
            <div className="user-info">
              <h5>{authUser ? authUser.displayName : "Anonymous User"}</h5>
              <p onClick={singoutORsingin}>{authUser ? "Logout" : "Singin"}</p>
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
      </div>
    );
  }
);

export default Menu;
