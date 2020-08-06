import React, { Component } from "react";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";

class Search extends Component {
  state = {
    searchVal: "",
    update: false,
  };

  //i've written it this way to avoid creating new funct each time a render method runs
  handleSearchInput = e => {
    return this.props.handleSearchInput(e, this.state.searchVal);
  };

  handleChange = ({ target }) => {
    const searchVal = target.value;
    this.setState({ searchVal });
  };

  render() {
    const { searchVal } = this.state;
    const { handleCloseSearch } = this.props;

    return (
      <div className="search" onKeyDown={this.handleSearchInput}>
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
