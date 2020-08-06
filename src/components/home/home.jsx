import React, { Component } from "react";
import { callServer } from "../../services/httpService";
import { flatten } from "../../services/helperFunctions";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    error: null,
  };

  _isMounted = false;

  static contextType = FirebaseContext;

  async componentDidMount() {
    this._isMounted = true;

    //firebase
    this.listener = this.context.isUserAuthenticated(userInfo => {
      if (userInfo && !userInfo.displayName) {
        this.context.user(userInfo.uid).on("value", snapshot => {
          const usersObject = snapshot.val();
          if (usersObject) this.context.updateUser(usersObject.name, null);
        });
      }
      this.setState({ authUser: userInfo });
    });

    // call the server
    let data;
    if (window.query) {
      data = await callServer(window.query);
      if (data[0].length === 0) this.setState({ error: "Picture not found!" });
    } else {
      data = await callServer();
    }
    if (this._isMounted) this.setState({ pictures: data });
  }

  componentWillUnmount() {
    this._isMounted = false;

    this.listener();
    this.context.users().off();
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
    const usernamee = this.props.location.pathname.split("/")[2];
    if (usernamee) this.props.history.push("/profile/" + usernamee);
    else this.props.history.push("/");
  };

  handleSearchInput = async ({ keyCode, target }, val) => {
    //update the state
    if (keyCode === 13 && val !== "") {
      this.setState({ pictures: [[], [], []] });
      const data = await callServer(val);
      if (data[0].length === 0) this.setState({ error: "Picture not found!" });
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
      await this.context.doSignOut();
      this.props.history.replace("/");
    }
  };

  handleLike = ({ target }, id) => {
    const { authUser } = this.state;

    if (!authUser) {
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
        .picture(authUser.uid, id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeBlack;
      target.className = "black heart";
      nextSibling.textContent = likes - 1;

      //about db
      this.context.picture(authUser.uid, id).remove();
    }
  };

  render() {
    const { pictures, authUser, error, searchAsked, menuAsked } = this.state;

    return (
      <div
        className="home"
        style={
          searchAsked ? { backgroundColor: "white" } : { backgroundColor: "" }
        }
      >
        {searchAsked ? (
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
          />
        ) : (
          <div style={{ textAlign: "center", color: "black" }}>
            {error ? <h1>{error}</h1> : <CircularProgress color="inherit" />}
          </div>
        )}

        <button className="more-btn">Load More</button>

        {menuAsked && (
          <Menu
            menuAsked={menuAsked}
            closeMenu={this.closeMenu}
            authUser={authUser}
            singoutORsingin={this.singoutORsingin}
          />
        )}
      </div>
    );
  }
}

export default Home;
