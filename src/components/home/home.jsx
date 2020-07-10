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
    pictures: [[], [], []],
  };

  async componentDidMount() {
    const data = await axios({
      headers: {
        Authorization: "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE",
      },
      url: "https://api.unsplash.com/search/photos?query=programming",
    });
    const data2 = await axios({
      headers: {
        Authorization: "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE",
      },
      url: "https://api.unsplash.com/search/photos?query=travel",
    });
    const data3 = await axios({
      headers: {
        Authorization: "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE",
      },
      url: "https://api.unsplash.com/search/photos?query=nature",
    });
    const clone = [...this.state.pictures];
    clone[0] = data.data.results;
    clone[1] = data2.data.results;
    clone[2] = data3.data.results;
    this.setState({ pictures: clone });
    console.log(data.data.results[0]);
  }

  askForMenu = () => {
    this.setState({ menuAsked: !this.state.menuAsked });
  };

  closeMenu = () => {
    this.setState({ menuAsked: false });
  };

  handlePictureClick = (id, { target }) => {
    console.log(target.className);
    if (!target.className.includes("heart"))
      this.props.history.push("/picture/" + id);
  };

  render() {
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
          <Menu menuAsked={this.state.menuAsked} />
        </Context.Provider>
      </div>
    );
  }
}

export default Home;
