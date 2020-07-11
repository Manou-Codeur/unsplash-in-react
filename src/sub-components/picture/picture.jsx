import React, { Component } from "react";

import Context from "./../../services/contextApi";
import likeBlack from "../../assets/img/favorite-white.svg";
import likeRed from "../../assets/img/favorite-red.png";
import downloadIcon from "../../assets/img/download.png";
import addIcon from "../../assets/img/add.svg";
import "./picture.scss";

class Picture extends Component {
  handleHover = () => {
    this.controlsRef.className = "controls";
    this.user.className = "picture-owner";
    this.picture.className = "background";
    this.picture.style.transform = "scale(1.1)";
  };

  handleLeave = () => {
    this.controlsRef.className = "controls hide";
    this.user.className = "picture-owner hide";
    this.picture.className = "background no-blur";
    this.picture.style.transform = "";
  };

  handleLike = ({ target }) => {
    const likes = parseInt(target.nextElementSibling.textContent);
    if (target.className === "black heart") {
      target.src = likeRed;
      target.className = "red heart";
      target.nextElementSibling.textContent = likes + 1;
    } else {
      target.src = likeBlack;
      target.className = "black heart";
      target.nextElementSibling.textContent = likes - 1;
    }
  };

  static contextType = Context;

  render() {
    const { data } = this.props;
    const userPP = data.user.profile_image.large;

    return (
      <div
        className="picture"
        onClick={this.context.handlePictureClick.bind(this, data)}
      >
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
              <img
                src={likeBlack}
                className="black heart"
                alt="heart icon"
                onClick={this.handleLike}
              />
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
