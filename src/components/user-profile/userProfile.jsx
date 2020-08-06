import React, { Component } from "react";
import { flatten } from "../../services/helperFunctions";
import {
  getUserPhotos,
  getUserLikes,
  getUserCollections,
  getCollectionPhotos,
} from "../../services/httpService";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    error: null,
    collectionError: null,
  };

  _isMounted = false;

  static contextType = FirebaseContext;

  async componentDidMount() {
    this.username = this.props.match.params.username;
    this._isMounted = true;

    const pictures = await getUserPhotos(this.username);

    if (this._isMounted)
      this.setState({ pictures, currentUser: pictures[0][0] });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleGetUserPhotos = async ({ target }) => {
    //prevent the user from calling the server without need to
    const node = target.parentNode;
    if (node.className.includes("one")) return;

    //init some state props
    this.setState({ collectionsAsked: false, pictures: [[], [], []] });

    //updating the styles
    node.className = "links one";

    //calling the server
    const pictures = await getUserPhotos(this.username);
    if (this._isMounted) this.setState({ pictures });
  };

  handleGetUserLikes = async ({ target }) => {
    //prevent the user from calling the server without need to
    const node = target.parentNode;
    if (node.className.includes("two")) return;

    //init some state props
    this.setState({ collectionsAsked: false, pictures: [[], [], []] });

    //updating the styles
    node.className = "links two";

    //calling the server
    const pictures = await getUserLikes(this.username);
    if (this._isMounted) {
      if (flatten(pictures).length === 0)
        this.setState({ error: "User hasn't liked any picture!" });
      else this.setState({ pictures });
    }
  };

  handleGetUserCollection = async ({ target }) => {
    //prevent the user from calling the server without need to
    const node = target.parentNode;
    if (node.className.includes("three")) return;

    //calling the server
    const collections = await getUserCollections(this.username);
    if (this._isMounted) {
      if (collections.length === 0)
        this.setState({ collectionError: "User doesn't has any collection!" });
      else this.setState({ collections });
    }

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
    this.props.history.push("/search/" + this.username);
  };

  handlePictureClick = (data, { target }) => {
    //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id);
  };

  handleCollectioClick = async id => {
    //call the server to get photos
    const pictures = await getCollectionPhotos(id);
    if (this._isMounted) {
      if (flatten(pictures).length > 0)
        this.setState({ pictures, collectionsAsked: false });
    }
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
    const { userAuth } = this.props;

    if (!userAuth) {
      this.props.history.push("/login");
      return;
    }
    const nextSibling = target.nextElementSibling;
    const likes = parseInt(nextSibling.textContent);
    if (target.className === "black heart") {
      target.src = likeRed;
      target.className = "red heart";
      nextSibling.textContent = likes + 1;

      //about db
      this.context
        .picture(userAuth.uid, id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeBlack;
      target.className = "black heart";
      nextSibling.textContent = likes - 1;

      //about db
      this.context.picture(userAuth.uid, id).remove();
    }
  };

  render() {
    const {
      pictures,
      collectionsAsked,
      collections,
      error,
      collectionError,
      currentUser,
      menuAsked,
    } = this.state;
    const { userAuth } = this.props;

    return (
      <div className="User-profile">
        <HeaderProfile
          showMenu={this.handleShowMenu}
          showSearch={this.handleShowSearch}
          getUserPhotos={this.handleGetUserPhotos}
          getUserLikes={this.handleGetUserLikes}
          getUserCollection={this.handleGetUserCollection}
          userInfo={currentUser}
        />

        {/* handle nonCollection error */}
        {!error && flatten(pictures).length === 0 ? (
          <div style={{ textAlign: "center", color: "black" }}>
            <CircularProgress color="inherit" />
          </div>
        ) : null}

        {!collectionsAsked && error ? (
          <h1 style={{ textAlign: "center" }}>{error}</h1>
        ) : null}

        {/* handle collection error */}
        {collectionsAsked && !collectionError && collections.length === 0 ? (
          <div style={{ textAlign: "center", color: "black" }}>
            <CircularProgress color="inherit" />
          </div>
        ) : null}

        {collectionsAsked && collectionError ? (
          <h1 style={{ textAlign: "center" }}>{collectionError}</h1>
        ) : null}

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

        {menuAsked && (
          <Menu
            menuAsked={menuAsked}
            closeMenu={this.closeMenuu}
            authUser={userAuth}
            singoutORsingin={this.singoutORsingin}
          />
        )}
      </div>
    );
  }
}

export default Userprofile;
