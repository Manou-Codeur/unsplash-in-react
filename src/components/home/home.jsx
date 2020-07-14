import React, { Component } from "react";

import { callServer } from "../../services/httpService";
import { flatten } from "../../services/helperFunctions";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";
import Search from "./../search/search";

import "./home.scss";

class Home extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
    searchAsked: this.props.search,
    searchVal: "",
  };

  async componentDidMount() {
    if (window.query) {
      const data = await callServer(window.query);
      this.setState({ pictures: data });
    } else {
      const data = await callServer();
      this.setState({ pictures: data });
    }
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
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + data.id);
  };

  handleSearchIconClick = () => {
    this.setState({ searchAsked: true });

    this.props.history.push("/search");
  };

  handleCloseSearch = () => {
    this.setState({ searchAsked: false });
    this.props.history.push("/home");
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

  render() {
    const { pictures } = this.state;

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
          />
        )}

        {flatten(pictures).length > 0 ? (
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

        <Menu menuAsked={this.state.menuAsked} closeMenu={this.closeMenu} />
      </div>
    );
  }
}

export default Home;
