import React, { Component } from "react";
import { flatten } from "../../services/helperFunctions";
import {
  getUserPhotos,
  getUserLikes,
  getUserCollections,
  getCollectionPhotos,
} from "../../services/httpService";

import FirebaseContext from "./../../services/firebase/firebaseContext";

import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Menu from "./../../sub-components/menu/menu";
import Picturegrid from "./../../sub-components/picture-grid/pictureGrid";
import Collection from "./../../sub-components/collection/collection";

import "./userProfile.scss";
import likeBlack from "../../assets/img/favorite-white.svg";
import likeRed from "../../assets/img/favorite-red.png";

class Userprofile extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
    collections: [],
    collectionsAsked: false,
    currentUser: "",
    authUser: null,
  };

  _isMounted = false;

  static contextType = FirebaseContext;

  async componentDidMount() {
    this._isMounted = true;

    //firebase
    this.context.isUserAuthenticated(userInfo => {
      if (this._isMounted) this.setState({ authUser: userInfo });
    });

    const username = this.props.match.params.username;
    const pictures = await getUserPhotos(username);

    if (this._isMounted)
      this.setState({ pictures, currentUser: pictures[0][0] });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleGetUserPhotos = async ({ target }) => {
    //init some state props
    this.setState({ collectionsAsked: false });

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
      if (this._isMounted) this.setState({ pictures });
    }
  };

  handleGetUserLikes = async ({ target }) => {
    //init some state props
    this.setState({ collectionsAsked: false });

    //prevent the user from calling the server without need to
    const node = target.parentNode;
    if (node.className.includes("two")) return;

    //updating the styles
    node.className = "links two";

    //calling the server
    const username = this.props.match.params.username;
    const pictures = await getUserLikes(username);
    if (this._isMounted) this.setState({ pictures });
  };

  handleGetUserCollection = async ({ target }) => {
    //prevent the user from calling the server without need to
    const node = target.parentNode;
    if (node.className.includes("three")) return;

    //calling the server
    const username = this.props.match.params.username;
    const collections = await getUserCollections(username);
    if (this._isMounted) this.setState({ collections });

    //updating the styles
    node.className = "links three";
    this.setState({ collectionsAsked: true });
  };

  closeMenuu = () => {
    this.setState({ menuAsked: false });
  };

  handleShowMenu = () => {
    this.setState({ menuAsked: true });
  };

  handleShowSearch = () => {
    const username = this.props.match.params.username;
    this.props.history.push("/search/" + username);
  };

  handlePictureClick = (data, { target }) => {
    //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
    const username = this.props.match.params.username;
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id + "/" + username);
  };

  handleCollectioClick = async id => {
    //call the server to get photos
    const pictures = await getCollectionPhotos(id);
    if (this._isMounted) this.setState({ pictures, collectionsAsked: false });
  };

  singoutORsingin = async ({ target }) => {
    if (target.textContent === "Singin") {
      this.props.history.replace("/login");
    } else {
      await this.context.doSignOut();
      this.props.history.replace("/");
    }
  };

  handleLike = ({ target }, id) => {
    if (!this.state.authUser) {
      this.props.history.push("/login");
      return;
    }

    const likes = parseInt(target.nextElementSibling.textContent);
    if (target.className === "black heart") {
      target.src = likeRed;
      target.className = "red heart";
      target.nextElementSibling.textContent = likes + 1;

      //about db
      this.context
        .picture(this.state.authUser.uid, id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeBlack;
      target.className = "black heart";
      target.nextElementSibling.textContent = likes - 1;

      //about db
      this.context.picture(this.state.authUser.uid, id).remove();
    }
  };

  render() {
    const { pictures, collectionsAsked, collections } = this.state;

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

        {collectionsAsked ? (
          <div className="collection-grid">
            {collections.map(collection => (
              <Collection
                key={collection.id}
                data={collection}
                handleOnclick={this.handleCollectioClick}
              />
            ))}
          </div>
        ) : (
          <Picturegrid
            pictures={pictures}
            handlePictureClick={this.handlePictureClick}
            handlePictureLike={this.handleLike}
          />
        )}

        {collections.length === 0 && collectionsAsked ? (
          <h1 style={{ textAlign: "center" }}>
            Sorry but this user doesn't have any collections
          </h1>
        ) : null}

        <Menu
          menuAsked={this.state.menuAsked}
          closeMenu={this.closeMenuu}
          authUser={this.state.authUser}
          singoutORsingin={this.singoutORsingin}
        />
      </div>
    );
  }
}

export default Userprofile;
