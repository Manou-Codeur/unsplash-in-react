import React, { Component } from "react";

import axios from "axios";

import "./fullImage.scss";
import likeWhitee from "../../assets/img/favorite-white.svg";
import likeRedd from "../../assets/img/favorite-red.png";
import downloadIconn from "../../assets/img/download.png";
import addIconn from "../../assets/img/add.svg";
import closeRounded from "../../assets/img/close-round.svg";
import infoIcon from "../../assets/img/info.svg";

class Fullimage extends Component {
  state = {
    pictures: [[], [], []],
    selectedPic: {},
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

    const test = [...clone[0], ...clone[1], ...clone[2]];
    const index = test.findIndex(el => el.id === this.props.match.params.id);
    const selectedPic = test[index];

    this.setState({ selectedPic });
  }

  handleClosePic = () => {
    this.props.history.goBack();
  };

  handleUserClick = () => {
    this.props.history.push("/profile/username");
  };

  handleLikePic = ({ target }) => {
    const likes = parseInt(target.nextElementSibling.textContent);
    if (target.className === "white heart") {
      target.src = likeRedd;
      target.className = "red heart";
      target.nextElementSibling.textContent = likes + 1;
    } else {
      target.src = likeWhitee;
      target.className = "white heart";
      target.nextElementSibling.textContent = likes - 1;
    }
  };

  render() {
    const { selectedPic } = this.state;
    console.log(selectedPic);

    if (Object.keys(selectedPic).length > 0)
      return (
        <div
          className="full-pic"
          style={{
            background: `url("${selectedPic.urls.regular}")`,
            backgroundSize: "cover",
          }}
        >
          <div className="filter">
            <div className="userANDclose">
              <div className="user-info">
                <div
                  className="img-containner"
                  style={{
                    background: `url(${selectedPic.user.profile_image.large})`,
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="user-name">
                  <p className="by">Photo by</p>
                  <p className="name" onClick={this.handleUserClick}>
                    {selectedPic.user.first_name +
                      " " +
                      selectedPic.user.last_name}
                  </p>
                </div>
              </div>
              <img src={closeRounded} alt="sds" onClick={this.handleClosePic} />
            </div>

            <img
              className="main-pic"
              src={selectedPic.urls.regular}
              alt="pic"
            />

            <div className="controls">
              <div className="img-containner one">
                <img
                  src={likeWhitee}
                  className="white heart"
                  onClick={this.handleLikePic}
                  alt="ds"
                />
                <p>{selectedPic.likes}</p>
              </div>
              <div className="img-containner">
                <img src={addIconn} alt="ds" />
              </div>
              <div className="img-containner">
                <img src={downloadIconn} alt="ds" />
              </div>
              <div className="img-containner">
                <img src={infoIcon} alt="ds" />
              </div>
            </div>
          </div>
        </div>
      );
    else return <h1>Please wait...</h1>;
  }
}

export default Fullimage;
