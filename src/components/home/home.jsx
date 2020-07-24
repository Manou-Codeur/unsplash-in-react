import React, { Component } from "react";
import { callServer } from "../../services/httpService";
import { flatten } from "../../services/helperFunctions";

import { FirebaseContext } from "./../../services/firebase/indexx";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Menu from "./../../sub-components/menu/menu";
import Search from "./../search/search";
import Picturegrid from "./../../sub-components/picture-grid/pictureGrid";

import "./home.scss";
import likeBlack from "../../assets/img/favorite-white.svg";
import likeRed from "../../assets/img/favorite-red.png";

class Home extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
    searchAsked: this.props.search,
    searchVal: "",
    authUser: null,
  };

  static contextType = FirebaseContext;

  async componentDidMount() {
    //firebase
    this.listener = this.context.isUserAuthenticated(userInfo => {
      if (userInfo && !userInfo.displayName) {
        this.context.user(userInfo.uid).on("value", snapshot => {
          const usersObject = snapshot.val();
          this.context.updateUser(usersObject.name, null);
        });
      }
      this.setState({ authUser: userInfo });
    });

    // call the server
    let data;
    if (window.query) {
      data = await callServer(window.query);
    } else {
      data = await callServer();
    }
    this.setState({ pictures: data });
  }

  componentWillUnmount() {
    this.listener();
  }

  componentDidUpdate(prevProps) {
    const { search } = this.props;
    if (prevProps.search !== search) {
      if (!search) {
        this.setState({ searchAsked: false });
      }
    }
  }

  askForMenu = () => {
    this.setState({ menuAsked: !this.state.menuAsked });
  };

  closeMenu = () => {
    this.setState({ menuAsked: false });
  };

  handlePictureClick = (data, { target }) => {
    //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id);
  };

  handleSearchIconClick = () => {
    this.setState({ searchAsked: true });
    this.props.history.push("/search");
  };

  handleCloseSearch = () => {
    this.setState({ searchAsked: false });
    this.props.history.goBack();
  };

  handleSearchInput = async ({ keyCode, target }, val) => {
    //update the state
    if (keyCode === 13 && val !== "") {
      const data = await callServer(val);
      this.setState({ pictures: data });
      window.query = val;
      target.value = "";
      target.focus();
    }
  };

  handleSubscribeClick = () => {
    this.props.history.push("/singup");
  };

  singoutORsingin = async ({ target }) => {
    if (target.textContent === "Singin") {
      this.props.history.replace("/login");
    } else {
      try {
        await this.context.doSignOut();
      } catch (error) {
        console.log(error);
      }
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
    const { pictures, authUser } = this.state;

    return (
      <div
        className="home"
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
          <Headerhome
            askForMenu={this.askForMenu}
            handleSubscribeClick={this.handleSubscribeClick}
            handleSearchIconClick={this.handleSearchIconClick}
            authUser={authUser}
          />
        )}

        {flatten(pictures).length > 0 ? (
          <Picturegrid
            pictures={pictures}
            handlePictureClick={this.handlePictureClick}
            handlePictureLike={this.handleLike}
            loggedOut={this.state.authUser}
          />
        ) : (
          <h1 style={{ textAlign: "center" }}>Please wait...</h1>
        )}

        <button className="more-btn">Load More</button>

        <Menu
          menuAsked={this.state.menuAsked}
          closeMenu={this.closeMenu}
          authUser={authUser}
          singoutORsingin={this.singoutORsingin}
        />
      </div>
    );
  }
}

export default Home;
