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
    const { searchVal } = this.state;
    const { handleSearchInput, handleCloseSearch } = this.props;

    return (
      <div className="search" onKeyDown={e => handleSearchInput(e, searchVal)}>
        <img className="cameraIcon" src={cameraIcon} alt="camera icon" />

        <div className="brandANDclose">
          <p>Search Mysplash</p>
          <img src={closeBlack} alt="close icon" onClick={handleCloseSearch} />
        </div>

        <input
          type="text"
          placeholder="Type something"
          value={searchVal}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Search;
