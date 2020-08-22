import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import menuBar from "../../assets/img/menu.svg";
import searchIcon from "../../assets/img/search.svg";
import "./headerProfile.scss";

const HeaderProfile = React.memo(
  ({
    showMenu,
    showSearch,
    getUserPhotos,
    getUserLikes,
    getUserCollection,
    userInfo,
  }) => {
    console.log("headerProfile--render");
    if (userInfo) {
      const { user } = userInfo;

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
              <div
                className="user-picture"
                style={{
                  background: `url(${user.profile_image.large})`,
                  backgroundSize: "cover",
                }}
              ></div>
              <p className="user-name">
                {user.first_name + " " + (user.last_name || "")}
              </p>
              <p className="user-website">www.mywebsite.com</p>
              <div className="links one">
                <p onClick={getUserPhotos}>Photos</p>
                <p onClick={getUserLikes}>Liked</p>
                <p onClick={getUserCollection}>Collections</p>
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
    } else {
      return (
        <div className="loading-header-home">
          <CircularProgress color="inherit" />
        </div>
      );
    }
  }
);

export default HeaderProfile;
