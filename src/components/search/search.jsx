import React, { useState } from "react";

import { callServer } from "./../../services/httpService";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";

const Search = ({ dispatchFunct }) => {
  const [searchVal, setSearchVal] = useState("");

  //i've written it this way to avoid creating new funct each time a render method runs
  const handleSearchInputt = e => {
    return handleSearchInput(e, searchVal);
  };

  const handleChange = ({ target }) => {
    const searchVal = target.value;
    setSearchVal(searchVal);
  };

  const handleCloseSearch = () => {
    dispatchFunct({ type: "SEARCH-ASKED", val: false });
  };

  const handleSearchInput = async ({ keyCode, target }, val) => {
    //update the state
    if (keyCode === 13 && val !== "") {
      dispatchFunct({ type: "PICTURES", data: [] });
      dispatchFunct({ type: "ERROR", message: null });
      const data = await callServer(val);
      if (data[0].length === 0) {
        dispatchFunct({ type: "ERROR", message: "Picture not found!" });
        return;
      }
      dispatchFunct({
        type: "PICTURES",
        data: [...data[0], ...data[1], ...data[2]],
      });
      window.query = val;
      target.value = "";
      target.focus();
    }
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
