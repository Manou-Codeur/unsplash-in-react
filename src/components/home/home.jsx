import React, { Component } from "react";

import { callServer } from "../../services/httpService";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";
import Context from "./../../services/contextApi";

import "./home.scss";

class Home extends Component {
  state = {
    menuAsked: false,
    pictures: [[], [], []],
    randomSearch: "cars",
  };

  async componentDidMount() {
    const data = await callServer(this.state.randomSearch);
    this.setState({ pictures: data });
  }

  askForMenu = () => {
    this.setState({ menuAsked: !this.state.menuAsked });
  };

  closeMenu = () => {
    this.setState({ menuAsked: false });
  };

  handlePictureClick = (data, { target }) => {
    if (!target.className.includes("heart"))
      this.props.history.push(
        "/picture/" + data.id + "/" + this.state.randomSearch
      );
  };

  render() {
    const { pictures } = this.state;

    return (
      <div className="home">
        <Context.Provider
          value={{
            askForMenu: this.askForMenu,
            closeMenu: this.closeMenu,
            handlePictureClick: this.handlePictureClick,
          }}
        >
          <Headerhome />
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
