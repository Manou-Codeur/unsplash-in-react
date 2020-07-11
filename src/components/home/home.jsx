import React, { Component } from "react";

import { callServer } from "../../services/httpService";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";
import Search from "./../search/search";
import Context from "./../../services/contextApi";

import "./home.scss";

class Home extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
    searchAsked: false,
  };

  async componentDidMount() {
    const data = await callServer();
    this.setState({ pictures: data });
    console.log(data[0][0]);
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
    this.setState({ searchAsked: !this.state.searchAsked });
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
        <Context.Provider
          value={{
            askForMenu: this.askForMenu,
            closeMenu: this.closeMenu,
            handlePictureClick: this.handlePictureClick,
            handleSearchIconClick: this.handleSearchIconClick,
          }}
        >
          {this.state.searchAsked ? <Search /> : <Headerhome />}

          {pictures[1].length > 0 ? (
            <div className="picture-grid">
              <div className="col-one col">
                {this.state.pictures[0].map(picture => (
                  <Picture key={picture.id} data={picture} />
                ))}
              </div>
              <div className="col-two col">
                {this.state.pictures[1].map(picture => (
                  <Picture key={picture.id} data={picture} />
                ))}
              </div>
              <div className="col-three col">
                {this.state.pictures[2].map(picture => (
                  <Picture key={picture.id} data={picture} />
                ))}
              </div>
            </div>
          ) : (
            <h1 style={{ textAlign: "center" }}>Please wait...</h1>
          )}

          <Menu menuAsked={this.state.menuAsked} />
        </Context.Provider>
      </div>
    );
  }
}

export default Home;
