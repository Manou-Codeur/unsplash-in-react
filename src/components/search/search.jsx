import React, { Component } from "react";

import Picture from "./../../sub-components/picture/picture";

import { callServer } from "./../../services/httpService";

import "./search.scss";
import cameraIcon from "../../assets/img/camera.svg";
import closeBlack from "../../assets/img/close-black.svg";
class Search extends Component {
  state = {
    pictures: [[], [], []],
  };

  async componentDidMount() {
    const pictures = await callServer();
    this.setState({ pictures });
  }

  handleCloseClick = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="search">
        <img className="cameraIcon" src={cameraIcon} alt="camera icon" />

        <div className="brandANDclose">
          <p>Search Mysplash</p>
          <img
            src={closeBlack}
            alt="close icon"
            onClick={this.handleCloseClick}
          />
        </div>

        <input type="text" placeholder="Type something" />

        {this.state.pictures[1].length > 0 ? (
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
      </div>
    );
  }
}

export default Search;
