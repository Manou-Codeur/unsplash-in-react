import React, { Component } from "react";

import { callServer } from "../../services/httpService";

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
  };

  async componentDidMount() {
    const { params } = this.props.match;
    let data = await callServer(params.query);

    data = [...data[0], ...data[1], ...data[2]];
    const index = data.findIndex(el => el.id === params.id);
    const selectedPic = data[index];

    this.setState({ selectedPic });
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
              alt="pic"
            />

            <div className="controls">
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
                <img src={downloadIconn} alt="ds" />
              </div>
              <div className="img-containner">
                <img src={infoIcon} alt="ds" />
              </div>
            </div>
          </div>
        </div>
      );
    else return <h1>Please wait...</h1>;
  }
}

export default Fullimage;
