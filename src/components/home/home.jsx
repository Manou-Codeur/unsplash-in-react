import React, { Component } from "react";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Picture from "./../../sub-components/picture/picture";
import Menu from "./../../sub-components/menu/menu";
import Context from "./../../services/contextApi";

import "./home.scss";

import axios from "axios";

class Home extends Component {
  state = {
    menuAsked: false,
    pictures: [],
  };

  async componentDidMount() {
    const data = await axios({
      headers: {
        Authorization: "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE",
      },
      url: "https://api.unsplash.com/search/photos?query=rain",
    });
    this.setState({ pictures: data.data.results });
    console.log(data.data.results[0]);
  }

  askForMenu = () => {
    this.setState({ menuAsked: !this.state.menuAsked });
  };

  closeMenu = () => {
    this.setState({ menuAsked: false });
  };

  render() {
    return (
      <div className="home">
        <Context.Provider
          value={{ askForMenu: this.askForMenu, closeMenu: this.closeMenu }}
        >
          <Headerhome />
          <div className="picture-grid">
            {this.state.pictures.map(picture => (
              <Picture key={picture.id} data={picture} />
            ))}
          </div>
          <Menu menuAsked={this.state.menuAsked} />
        </Context.Provider>
      </div>
    );
  }
}

export default Home;
