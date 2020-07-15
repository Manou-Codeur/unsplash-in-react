import React, { Component } from "react";
import { flatten } from "../../services/helperFunctions";
import {
  callServer,
  getUserPhotos,
  getUserLikes,
} from "../../services/httpService";

import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";

import "./userProfile.scss";

class Userprofile extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
    collectionsAsked: false,
    currentUser: "",
  };

  async componentDidMount() {
    let data;
    if (window.query) {
      data = await callServer(window.query);
    } else {
      const username = this.props.match.params.username;
      data = await getUserPhotos(username);
    }
    this.setState({ pictures: data, currentUser: data[0][0] });
  }

  handleGetUserPhotos = async ({ target }) => {
    //prevent the user from calling the server without need to
    const username = this.props.match.params.username;
    const picturesArr = flatten(this.state.pictures);
    let shouldICallServer = false;
    for (let picture of picturesArr) {
      if (picture.user.username !== username) shouldICallServer = true;
    }

    //updating the styles
    const node = target.parentNode;
    node.className = "links one";

    if (shouldICallServer) {
      //calling the server
      const pictures = await getUserPhotos(username);
      this.setState({ pictures });
    }
  };

  handleGetUserLikes = async ({ target }) => {
    //prevent the user from calling the server without need to
    const node = target.parentNode;
    if (node.className.includes("two")) return;

    //updating the styles
    node.className = "links two";

    //calling the server
    const username = this.props.match.params.username;
    const pictures = await getUserLikes(username);
    this.setState({ pictures });
  };

  handleGetUserCollection = ({ target }) => {
    //updating the styles
    const node = target.parentNode;
    node.className = "links three";

    //calling the server
  };

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
    //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
    const username = this.props.match.params.username;
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id + "/" + username);
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
    const { pictures } = this.state;

    return (
      <div className="User-profile">
        <HeaderProfile
          showMenu={this.handleShowMenu}
          showSearch={this.handleShowSearch}
          getUserPhotos={this.handleGetUserPhotos}
          getUserLikes={this.handleGetUserLikes}
          getUserCollection={this.handleGetUserCollection}
          userInfo={this.state.currentUser}
        />

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

        <Menu menuAsked={this.state.menuAsked} closeMenu={this.closeMenuu} />
      </div>
    );
  }
}

export default Userprofile;
