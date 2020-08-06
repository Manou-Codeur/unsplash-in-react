import React, { Component } from "react";

import { download, getPicture } from "../../services/httpService";
import { formatDate, getCamera } from "../../services/pictureInfo";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  };

  _isMounted = false;

  static contextType = FirebaseContext;

  async componentDidMount() {
    this._isMounted = true;

    const { params } = this.props.match;
    const { userAuth } = this.props;
    const selectedPic = await getPicture(params.id);
    const linkToPicture = await download(params.id);

    if (this._isMounted) this.setState({ selectedPic, linkToPicture });

    //firebase
    if (userAuth) {
      this.context.picture(userAuth.uid, params.id).on("value", snapshot => {
        const usersObject = snapshot.val();
        if (this._isMounted) {
          this.setState({
            liked: usersObject && usersObject.liked,
            likes: usersObject && usersObject.likes,
          });
        }
      });
    }
  }

  //performance
  shouldComponentUpdate(nextPros, nextState) {
    return this.state.linkToPicture !== nextState.linkToPicture;
  }

  componentWillUnmount() {
    this._isMounted = false;

    //about firebase
    const { userAuth } = this.props;
    const { params } = this.props.match;

    if (userAuth) {
      this.context.picture(userAuth.uid, params.id).off();
    }
  }

  handleClosePic = () => {
    this.props.history.goBack();
  };

  handleUserClick = () => {
    const { selectedPic } = this.state;
    this.props.history.push("/profile/" + selectedPic.user.username);
  };

  handleLikePic = ({ target }) => {
    const { params } = this.props.match;
    const { userAuth } = this.props;
    const nextSibling = target.nextElementSibling;

    const likes = parseInt(nextSibling.textContent);
    if (target.className === "white heart") {
      target.src = likeRedd;
      target.className = "red heart";
      nextSibling.textContent = likes + 1;

      //about db
      this.context
        .picture(userAuth.uid, params.id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeWhitee;
      target.className = "white heart";
      nextSibling.textContent = likes - 1;

      //about db
      this.context.picture(userAuth.uid, params.id).remove();
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
            background: `url("${selectedPic.urls.thumb}") center`,
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
              alt="random"
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
    return (
      <div className="full-pic-loading">
        <CircularProgress color="inherit" />
      </div>
    );
  }
}

export default Fullimage;
