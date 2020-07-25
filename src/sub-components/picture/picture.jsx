import React, { Component } from "react";

import FirebaseContext from "./../../services/firebase/firebaseContext";

import likeRed from "../../assets/img/favorite-red.png";
import likeBlack from "../../assets/img/favorite-white.svg";
import downloadIcon from "../../assets/img/download.png";
import addIcon from "../../assets/img/add.svg";
import "./picture.scss";

class Picture extends Component {
  state = {
    liked: false,
    likes: null,
    authUser: null,
  };

  static contextType = FirebaseContext;

  componentDidMount() {
    this.listener = this.context.isUserAuthenticated(userInfo => {
      if (userInfo) {
        this.context
          .picture(userInfo.uid, this.props.data.id)
          .on("value", snapshot => {
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

  componentWillUnmount() {
    this.listener();
    if (this.state.authUser)
      this.context.pictures(this.state.authUser.uid).off();
  }

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

  render() {
    const { data, handlePictureClick, loggedOut } = this.props;
    const { liked, likes } = this.state;
    const userPP = data.user.profile_image.large;

    return (
      <div
        className="picture"
        onClick={handlePictureClick.bind(this, data)}
        style={{ backgroundColor: data.color }}
        title={data.description}
      >
        <img
          className="background no-blur"
          src={data.urls.regular}
          alt={data.description}
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
              {data.user.first_name + " " + (data.user.last_name || "")}
            </p>
          </div>

          <div className="controls hide" ref={el => (this.controlsRef = el)}>
            <div className="imgg-containner one">
              <img
                //we will comeback to when the user logout
                src={liked && loggedOut ? likeRed : likeBlack}
                className={liked ? "red heart" : "black heart"}
                alt="heart icon"
                onClick={e => this.props.handlePictureLike(e, data.id)}
              />
              <p>{likes ? likes : data.likes}</p>
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
