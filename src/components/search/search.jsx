import React, { Component } from "react";

import { callServer } from "./../../services/httpService";

import Context from "./../../services/contextApi";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";

class Search extends Component {
  static contextType = Context;

  render() {
    return (
      <div className="search">
        <img className="cameraIcon" src={cameraIcon} alt="camera icon" />

        <div className="brandANDclose">
          <p>Search Mysplash</p>
          <img
            src={closeBlack}
            alt="close icon"
            onClick={this.context.handleSearchIconClick}
          />
        </div>

        <input type="text" placeholder="Type something" />
      </div>
    );
  }
}

export default Search;
