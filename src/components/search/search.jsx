import React, { useState } from "react";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";

const Search = ({ handleSearchInput, handleCloseSearch }) => {
  const [searchVal, setSearchVal] = useState("");

  //i've written it this way to avoid creating new funct each time a render method runs
  const handleSearchInputt = e => {
    return handleSearchInput(e, searchVal);
  };

  const handleChange = ({ target }) => {
    const searchVal = target.value;
    setSearchVal(searchVal);
  };

  return (
    <div className="search" onKeyDown={handleSearchInputt}>
      <img className="cameraIcon" src={cameraIcon} alt="camera icon" />

      <div className="brandANDclose">
        <p>Search Mysplash</p>
        <img src={closeBlack} alt="close icon" onClick={handleCloseSearch} />
      </div>

      <input
        type="text"
        placeholder="Type something"
        value={searchVal}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
