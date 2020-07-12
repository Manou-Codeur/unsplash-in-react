import React, { Component } from "react";

import { callServer } from "./../../services/httpService";
import { flatten } from "../../services/helperFunctions";

import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";
import Search from "./../search/search";

import "./userProfile.scss";

class Userprofile extends Component {
  state = {
    menuAsked: false,
    searchAsked: false,
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

  closeMenuu = () => {
    this.setState({ menuAsked: false });
  };

  handleShowMenu = () => {
    this.setState({ menuAsked: true });
  };

  handleShowSearch = () => {
    this.setState({ searchAsked: true });
  };

  handleCloseSearch = () => {
    this.setState({ searchAsked: false });
    this.props.history.push("/profile/" + this.props.match.params.username);
  };

  handleSearchInput = async ({ keyCode, target }, val) => {
    if (keyCode === 13 && val !== "") {
      const data = await callServer(val);
      this.setState({ pictures: data });
      window.query = val;
      target.value = "";
      target.focus();
    }
  };

  handlePictureClick = (data, { target }) => {
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id);
  };

  render() {
    return (
      <div
        className="User-profile"
        style={
          this.state.searchAsked
            ? { backgroundColor: "white" }
            : { backgroundColor: "" }
        }
      >
        {this.state.searchAsked ? (
          <Search
            handleCloseSearch={this.handleCloseSearch}
            handleSearchInput={this.handleSearchInput}
          />
        ) : (
          <HeaderProfile
            showMenu={this.handleShowMenu}
            showSearch={this.handleShowSearch}
            getUserPhotos={this.handleGetUserPhotos}
            getUserLikes={this.handleGetUserLikes}
            getUserCollection={this.handleGetUserCollection}
          />
        )}

        {flatten(this.state.pictures).length > 0 ? (
          <div className="picture-grid">
            <div className="col-one col">
              {this.state.pictures[0].map(picture => (
                <Picture
                  handlePictureClick={this.handlePictureClick}
                  key={picture.id}
                  data={picture}
                />
              ))}
            </div>
            <div className="col-two col">
              {this.state.pictures[1].map(picture => (
                <Picture
                  handlePictureClick={this.handlePictureClick}
                  key={picture.id}
                  data={picture}
                />
              ))}
            </div>
            <div className="col-three col">
              {this.state.pictures[2].map(picture => (
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
