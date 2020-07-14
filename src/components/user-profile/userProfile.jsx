import React, { Component } from "react";
import { flatten } from "../../services/helperFunctions";
import { callServer } from "../../services/httpService";

import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";

import "./userProfile.scss";

class Userprofile extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
  };

  handleGetUserPhotos = () => {
    console.log(
      "here i will ask the http to give me the photos published by this user"
    );
  };

  handleGetUserLikes = () => {
    console.log("here i will ask http to give me user likes pictures");
  };

  handleGetUserCollection = () => {
    console.log("here i will ask http to give me user collection pictures");
  };

  async componentDidMount() {
    let data;
    if (window.query) {
      data = await callServer(window.query);
    } else {
      data = await callServer();
    }
    this.setState({ pictures: data });
  }

  closeMenuu = () => {
    this.setState({ menuAsked: false });
  };

  handleShowMenu = () => {
    this.setState({ menuAsked: true });
  };

  handleShowSearch = () => {
    this.props.history.push("/search");
  };

  handlePictureClick = (data, { target }) => {
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id);
  };

  render() {
    const { pictures } = this.state;

    return (
      <div className="User-profile">
        <HeaderProfile
          showMenu={this.handleShowMenu}
          showSearch={this.handleShowSearch}
          getUserPhotos={this.handleGetUserPhotos}
          getUserLikes={this.handleGetUserLikes}
          getUserCollection={this.handleGetUserCollection}
        />

        {flatten(pictures).length > 0 ? (
          <div className="picture-grid">
            <div className="col-one col">
              {pictures[0].map(picture => (
                <Picture
                  handlePictureClick={this.handlePictureClick}
                  key={picture.id}
                  data={picture}
                />
              ))}
            </div>
            <div className="col-two col">
              {pictures[1].map(picture => (
                <Picture
                  handlePictureClick={this.handlePictureClick}
                  key={picture.id}
                  data={picture}
                />
              ))}
            </div>
            <div className="col-three col">
              {pictures[2].map(picture => (
                <Picture
                  handlePictureClick={this.handlePictureClick}
                  key={picture.id}
                  data={picture}
                />
              ))}
            </div>
          </div>
        ) : (
          <h1 style={{ textAlign: "center" }}>Please wait...</h1>
        )}

        <Menu menuAsked={this.state.menuAsked} closeMenu={this.closeMenuu} />
      </div>
    );
  }
}

export default Userprofile;
