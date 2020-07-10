import React, { Component } from "react";

import likeBlack from "../../assets/img/favorite.png";
import likeRed from "../../assets/img/favorite-red.png";
import downloadIcon from "../../assets/img/download.png";
import addIcon from "../../assets/img/add-btn.png";
import "./picture.scss";

class Picture extends Component {
  handleHover = () => {
    this.controlsRef.className = "controls";
    this.user.className = "picture-owner";
    this.picture.className = "background";
  };

  handleLeave = () => {
    this.controlsRef.className = "controls hide";
    this.user.className = "picture-owner hide";
    this.picture.className = "background no-blur";
  };

  render() {
    const { data } = this.props;
    const userPP = data.user.profile_image.large;

    return (
      <div className="picture">
        <img
          className="background no-blur"
          src={data.urls.regular}
          alt="test"
          ref={el => (this.picture = el)}
        />

        <div
          className="content-containner"
          onMouseEnter={this.handleHover}
          onMouseLeave={this.handleLeave}
        >
          <div className="picture-owner hide" ref={el => (this.user = el)}>
            <div
              className="img-containner"
              style={{ background: `url(${userPP})`, backgroundSize: "cover" }}
            ></div>
            <p className="by">Photo by</p>
            <p className="user-name">
              {data.user.first_name + " " + data.user.last_name}
            </p>
          </div>

          <div className="controls hide" ref={el => (this.controlsRef = el)}>
            <div className="imgg-containner one">
              <img src={likeRed} alt="heart icon" />
              <p>{data.likes}</p>
            </div>
            <div className="imgg-containner">
              <img className="test" src={addIcon} alt="plus icon" />
            </div>
            <div className="imgg-containner">
              <img src={downloadIcon} alt="download icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Picture;
