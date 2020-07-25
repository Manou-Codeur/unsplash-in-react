import React, { Component } from "react";

import {
  callServer,
  download,
  getUserPhotos,
} from "../../services/httpService";
import { formatDate, getCamera } from "../../services/pictureInfo";

import infoIcon from "../../assets/img/info.svg";

import "./fullImage.scss";
import likeWhitee from "../../assets/img/favorite-white.svg";
import likeRedd from "../../assets/img/favorite-red.png";
import downloadIconn from "../../assets/img/download.png";
import addIconn from "../../assets/img/add.svg";
import closeRounded from "../../assets/img/close-round.svg";
import FirebaseContext from "./../../services/firebase/firebaseContext";

class Fullimage extends Component {
  state = {
    selectedPic: {},
    linkToPicture: "",
    liked: false,
    likes: null,
    authUser: null,
  };

  static contextType = FirebaseContext;

  async componentDidMount() {
    var data;
    const { params } = this.props.match;
    const { pathname } = this.props.location;
    const username = pathname.split("/")[3];

    if (window.query) {
      data = await callServer(window.query);
    } else if (username) {
      data = await getUserPhotos(username);
    } else {
      data = await callServer();
    }

    data = [...data[0], ...data[1], ...data[2]];
    const index = data.findIndex(el => el.id === params.id);
    const selectedPic = data[index];

    const linkToPicture = await download(params.id);

    this.setState({ selectedPic, linkToPicture });

    //firebase
    this.listener = this.context.isUserAuthenticated(userInfo => {
      if (userInfo) {
        this.context.picture(userInfo.uid, params.id).on("value", snapshot => {
          const usersObject = snapshot.val();
          this.setState({
            authUser: userInfo,
            liked: usersObject && usersObject.liked,
            likes: usersObject && usersObject.likes,
          });
        });
      }
    });
  }

  handleClosePic = () => {
    this.props.history.goBack();
  };

  handleUserClick = () => {
    this.props.history.push("/profile/" + this.state.selectedPic.user.username);
  };

  handleLikePic = ({ target }) => {
    const { params } = this.props.match;
    const { authUser } = this.state;

    const likes = parseInt(target.nextElementSibling.textContent);
    if (target.className === "white heart") {
      target.src = likeRedd;
      target.className = "red heart";
      target.nextElementSibling.textContent = likes + 1;

      //about db
      this.context
        .picture(authUser.uid, params.id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeWhitee;
      target.className = "white heart";
      target.nextElementSibling.textContent = likes - 1;

      //about db
      this.context.picture(authUser.uid, params.id).remove();
    }
  };

  handleInfoClick = () => {
    this.mainPicture.className += " hidee";
    this.controlsLayout.className += " hidee";
    this.infoLayout.className = "info";
  };

  render() {
    const { selectedPic, liked, likes } = this.state;

    if (selectedPic && Object.keys(selectedPic).length > 0) {
      const date = selectedPic.created_at.split("T")[0];

      return (
        <div
          className="full-pic"
          style={{
            background: `url("${selectedPic.urls.regular}") center`,
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
                      (selectedPic.user.last_name || "")}
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
                  <p>{formatDate(date)}</p>
                </div>
                <div className="item">
                  <span>Camera</span>
                  <p>{getCamera()}</p>
                </div>
                <div className="item">
                  <span>Focal Length</span>
                  <p>60.7 mm</p>
                </div>
              </div>

              <div className="right-part">
                <div className="item">
                  <span>Dimensions</span>
                  <p>{selectedPic.width + " x " + selectedPic.height}</p>
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
                  src={liked ? likeRedd : likeWhitee}
                  className={liked ? "red heart" : "white heart"}
                  onClick={this.handleLikePic}
                  alt="heart icon"
                />
                <p>{likes ? likes : selectedPic.likes}</p>
              </div>
              <div className="img-containner">
                <img src={addIconn} alt="ds" />
              </div>
              <div className="img-containner">
                <a
                  href={this.state.linkToPicture}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
    }
    return <h1>Please wait...</h1>;
  }
}

export default Fullimage;
