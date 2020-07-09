import React from "react";

import test from "../../assets/img/test.jpg";
import likeBlack from "../../assets/img/favorite.png";
import likeRed from "../../assets/img/favorite-red.png";
import downloadIcon from "../../assets/img/download.png";
import addIcon from "../../assets/img/add-btn.png";
import "./picture.scss";

const Picture = props => {
  return (
    <div className="picture">
      <img className="background" src={test} alt="test" />

      <div className="picture-owner">
        <div className="img-containner"></div>
        <p className="by">Photo by</p>
        <p className="user-name">Ayache Salim</p>
      </div>

      <div className="controls">
        <div className="imgg-containner one">
          <img src={likeRed} alt="ds" />
          <p>445</p>
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
