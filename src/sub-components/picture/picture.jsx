import React from "react";

import test from "../../assets/img/test.jpg";
import likeBlack from "../../assets/img/favorite.png";
import likeRed from "../../assets/img/favorite-red.png";
import downloadIcon from "../../assets/img/download.png";
import addIcon from "../../assets/img/add-btn.png";
import "./picture.scss";

const Picture = ({ data }) => {
  const userPP = data.user.profile_image.large;

  return (
    <div className="picture">
      <img className="background" src={data.urls.regular} alt="test" />

      <div className="picture-owner">
        <div
          className="img-containner"
          style={{ background: `url(${userPP})`, backgroundSize: "cover" }}
        ></div>
        <p className="by">Photo by</p>
        <p className="user-name">
          {data.user.first_name + " " + data.user.last_name}
        </p>
      </div>

      <div className="controls">
        <div className="imgg-containner one">
          <img src={likeRed} alt="ds" />
          <p>{data.likes}</p>
        </div>
        <div className="imgg-containner">
          <img src={addIcon} alt="ds" />
        </div>
        <div className="imgg-containner">
          <img src={downloadIcon} alt="ds" />
        </div>
      </div>
    </div>
  );
};

export default Picture;
