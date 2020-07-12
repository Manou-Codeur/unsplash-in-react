import React, { Component } from "react";

import Context from "./../../services/contextApi";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";

class Search extends Component {
  state = {
    searchVal: "",
  };

  static contextType = Context;

  handleChange = ({ target }) => {
    const searchVal = target.value;
    this.setState({ searchVal });
  };

  render() {
    return (
      <div
        className="search"
        onKeyDown={e => this.context.handleSearchInput(e, this.state.searchVal)}
      >
        <img className="cameraIcon" src={cameraIcon} alt="camera icon" />

        <div className="brandANDclose">
          <p>Search Mysplash</p>
          <img
            src={closeBlack}
            alt="close icon"
            onClick={this.context.handleSearchIconClick}
          />
        </div>

        <input
          type="text"
          placeholder="Type something"
          value={this.state.searchVal}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Search;
