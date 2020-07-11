import React, { Component } from "react";

import { callServer, download } from "../../services/httpService";

import "./fullImage.scss";
import likeWhitee from "../../assets/img/favorite-white.svg";
import likeRedd from "../../assets/img/favorite-red.png";
import downloadIconn from "../../assets/img/download.png";
import addIconn from "../../assets/img/add.svg";
import closeRounded from "../../assets/img/close-round.svg";
import infoIcon from "../../assets/img/info.svg";

class Fullimage extends Component {
  state = {
    selectedPic: {},
    linkToPicture: "",
  };

  async componentDidMount() {
    const { params } = this.props.match;
    let data = await callServer();

    data = [...data[0], ...data[1], ...data[2]];
    const index = data.findIndex(el => el.id === params.id);
    const selectedPic = data[index];

    const linkToPicture = await download(params.id);

    this.setState({ selectedPic, linkToPicture });
  }

  handleClosePic = () => {
    this.props.history.goBack();
  };

  handleUserClick = () => {
    this.props.history.push("/profile/username");
  };

  handleLikePic = ({ target }) => {
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

  handleInfoClick = () => {
    this.mainPicture.className += " hidee";
    this.controlsLayout.className += " hidee";
    this.infoLayout.className = "info";
  };

  render() {
    const { selectedPic } = this.state;

    if (Object.keys(selectedPic).length > 0)
      return (
        <div
          className="full-pic"
          style={{
            background: `url("${selectedPic.urls.regular}")`,
            backgroundSize: "cover",
          }}
        >
          <div className="filter">
            <div className="userANDclose">
              <div className="user-info">
                <div
                  className="img-containner"
                  style={{
                    background: `url(${selectedPic.user.profile_image.large})`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="user-name">
                  <p className="by">Photo by</p>
                  <p className="name" onClick={this.handleUserClick}>
                    {selectedPic.user.first_name +
                      " " +
                      selectedPic.user.last_name}
                  </p>
                </div>
              </div>
              <img src={closeRounded} alt="sds" onClick={this.handleClosePic} />
            </div>

            <img
              className="main-pic"
              src={selectedPic.urls.regular}
              ref={el => (this.mainPicture = el)}
              alt="pic"
            />

            <div className="info hidee" ref={el => (this.infoLayout = el)}>
              <div className="left-part">
                <div className="item">
                  <span>Published</span>
                  <p>March 25, 2016</p>
                </div>
                <div className="item">
                  <span>Camera</span>
                  <p>FujiFilm</p>
                </div>
                <div className="item">
                  <span>Focal Length</span>
                  <p>60.7 mm</p>
                </div>
              </div>

              <div className="right-part">
                <div className="item">
                  <span>Dimensions</span>
                  <p>4000 x 2658</p>
                </div>
                <div className="item">
                  <span>Dimensions</span>
                  <p>X-T1</p>
                </div>
                <div className="item">
                  <span>Shutter Speed</span>
                  <p>0.01 sec</p>
                </div>
              </div>
            </div>

            <div className="controls" ref={el => (this.controlsLayout = el)}>
              <div className="img-containner one">
                <img
                  src={likeWhitee}
                  className="white heart"
                  onClick={this.handleLikePic}
                  alt="ds"
                />
                <p>{selectedPic.likes}</p>
              </div>
              <div className="img-containner">
                <img src={addIconn} alt="ds" />
              </div>
              <div className="img-containner">
                <a href={this.state.linkToPicture} target="_blank">
                  <img src={downloadIconn} alt="ds" />
                </a>
              </div>
              <div className="img-containner">
                <img src={infoIcon} alt="ds" onClick={this.handleInfoClick} />
              </div>
            </div>
          </div>
        </div>
      );
    else return <h1>Please wait...</h1>;
  }
}

export default Fullimage;
