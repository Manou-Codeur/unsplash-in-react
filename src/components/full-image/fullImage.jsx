import React from "react";

import "./fullImage.scss";
import test from "../../assets/img/test.jpg";
import likeWhitee from "../../assets/img/favorite-white.svg";
import likeRedd from "../../assets/img/favorite-red.png";
import downloadIconn from "../../assets/img/download.png";
import addIconn from "../../assets/img/add.svg";
import closeRounded from "../../assets/img/close-round.svg";
import infoIcon from "../../assets/img/info.svg";

const Fullimage = props => {
  const handleClosePic = () => {
    props.history.goBack();
  };

  const handleUserClick = () => {
    props.history.push("/profile/username");
  };

  const handleLikePic = ({ target }) => {
    const likes = parseInt(target.nextElementSibling.textContent);
    if (target.className === "white heart") {
      target.src = likeRedd;
      target.className = "red heart";
      target.nextElementSibling.textContent = likes + 1;
    } else {
      target.src = likeWhitee;
      target.className = "white heart";
      target.nextElementSibling.textContent = likes - 1;
    }
  };

  return (
    <div className="full-pic">
      <div className="filter">
        <div className="userANDclose">
          <div className="user-info">
            <div
              className="img-containner"
              style={{ background: `url(${test})`, backgroundSize: "cover" }}
            ></div>
            <div className="user-name">
              <p className="by">Photo by</p>
              <p className="name" onClick={handleUserClick}>
                Ayache Salim
              </p>
            </div>
          </div>
          <img src={closeRounded} alt="sds" onClick={handleClosePic} />
        </div>

        <img className="main-pic" src={test} alt="pic" />

        <div className="controls">
          <div className="img-containner one">
            <img
              src={likeWhitee}
              className="white heart"
              onClick={handleLikePic}
              alt="ds"
            />
            <p>445</p>
          </div>
          <div className="img-containner">
            <img src={addIconn} alt="ds" />
          </div>
          <div className="img-containner">
            <img src={downloadIconn} alt="ds" />
          </div>
          <div className="img-containner">
            <img src={infoIcon} alt="ds" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fullimage;
