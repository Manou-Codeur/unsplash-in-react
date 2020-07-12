import React, { Component } from "react";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";

class Search extends Component {
  state = {
    searchVal: "",
  };

  handleChange = ({ target }) => {
    const searchVal = target.value;
    this.setState({ searchVal });
  };

  render() {
    return (
      <div
        className="search"
        onKeyDown={e => this.props.handleSearchInput(e, this.state.searchVal)}
      >
        <img className="cameraIcon" src={cameraIcon} alt="camera icon" />

        <div className="brandANDclose">
          <p>Search Mysplash</p>
          <img
            src={closeBlack}
            alt="close icon"
            onClick={this.props.handleCloseSearch}
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
