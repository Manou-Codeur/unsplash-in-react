import React, { useState, useContext, useEffect, useRef } from "react";

import { download, getPicture } from "../../services/httpService";
import { formatDate, getCamera } from "../../services/pictureInfo";
import CircularProgress from "@material-ui/core/CircularProgress";

import infoIcon from "../../assets/img/info.svg";

import "./fullImage.scss";
import likeWhitee from "../../assets/img/favorite-white.svg";
import likeRedd from "../../assets/img/favorite-red.png";
import downloadIconn from "../../assets/img/download.png";
import addIconn from "../../assets/img/add.svg";
import closeRounded from "../../assets/img/close-round.svg";
import FirebaseContext from "./../../services/firebase/firebaseContext";

const Fullimage = ({ match, userAuth, history }) => {
  const [selectedPic, setSelectedPic] = useState({});
  const [linkToPicture, setLinkToPicture] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(null);
  const [existInDB, setExistInDB] = useState(null);
  const [httpErrors, setHttpErrors] = useState(null);

  const firebaseContext = useContext(FirebaseContext);

  const mainPicture = useRef();
  const infoLayout = useRef();
  const controlsLayout = useRef();

  useEffect(() => {
    let isMounted = true;

    getPicture(match.params.id)
      .then(picture => {
        if (isMounted) setSelectedPic(picture);
      })
      .catch(err => {
        setHttpErrors(err);
      });

    download(match.params.id)
      .then(link => {
        if (isMounted) setLinkToPicture(link);
      })
      .catch(err => {
        setHttpErrors(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    //firebase
    if (userAuth) {
      firebaseContext
        .picture(userAuth.uid, match.params.id)
        .on("value", snapshot => {
          const usersObject = snapshot.val();
          if (isMounted && usersObject) {
            setLiked(usersObject.liked);
            setLikes(usersObject.likes);
          } else {
            setExistInDB("no");
          }
        });
    }

    return () => {
      isMounted = false;
      if (userAuth) {
        firebaseContext.picture(userAuth.uid, match.params.id).off();
      }
    };
  }, [userAuth, firebaseContext]);

  const handleClosePic = () => {
    history.goBack();
  };

  const handleUserClick = () => {
    history.push("/profile/" + selectedPic.user.username);
  };

  const handleLikePic = ({ target }) => {
    const nextSibling = target.nextElementSibling;

    const likes = parseInt(nextSibling.textContent);
    if (target.className === "white heart") {
      target.src = likeRedd;
      target.className = "red heart";
      nextSibling.textContent = likes + 1;

      //about db
      firebaseContext
        .picture(userAuth.uid, match.params.id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeWhitee;
      target.className = "white heart";
      nextSibling.textContent = likes - 1;

      //about db
      firebaseContext.picture(userAuth.uid, match.params.id).remove();
    }
  };

  const handleInfoClick = () => {
    mainPicture.current.className += " hidee";
    controlsLayout.current.className += " hidee";
    infoLayout.current.className = "info";
  };

  if (httpErrors) throw new Error(httpErrors);
  else if (
    selectedPic &&
    Object.keys(selectedPic).length > 0 &&
    (liked || existInDB === "no")
  ) {
    const date = selectedPic.created_at.split("T")[0];

    return (
      <div
        className="full-pic"
        style={{
          background: `url("${selectedPic.urls.thumb}") center`,
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
                <p className="name" onClick={handleUserClick}>
                  {selectedPic.user.first_name +
                    " " +
                    (selectedPic.user.last_name || "")}
                </p>
              </div>
            </div>
            <img src={closeRounded} alt="sds" onClick={handleClosePic} />
          </div>

          <img
            className="main-pic"
            src={selectedPic.urls.regular}
            ref={mainPicture}
            alt="random"
          />

          <div className="info hidee" ref={infoLayout}>
            <div className="left-part">
              <div className="item">
                <span>Published</span>
                <p>{formatDate(date)}</p>
              </div>
              <div className="item">
                <span>Camera</span>
                <p>{getCamera()}</p>
              </div>
              <div className="item">
                <span>Focal Length</span>
                <p>60.7 mm</p>
              </div>
            </div>

            <div className="right-part">
              <div className="item">
                <span>Dimensions</span>
                <p>{selectedPic.width + " x " + selectedPic.height}</p>
              </div>
              <div className="item">
                <span>Dimensions</span>
                <p>X-T1</p>
              </div>
              <div className="item">
                <span>Shutter Speed</span>
                <p>0.01 sec</p>
              </div>
            </div>
          </div>

          <div className="controls" ref={controlsLayout}>
            <div className="img-containner one">
              <img
                src={liked ? likeRedd : likeWhitee}
                className={liked ? "red heart" : "white heart"}
                onClick={handleLikePic}
                alt="heart icon"
              />
              <p>{likes ? likes : selectedPic.likes}</p>
            </div>
            <div className="img-containner">
              <img src={addIconn} alt="ds" />
            </div>
            <div className="img-containner">
              <a href={linkToPicture} target="_blank" rel="noopener noreferrer">
                <img src={downloadIconn} alt="ds" />
              </a>
            </div>
            <div className="img-containner">
              <img src={infoIcon} alt="ds" onClick={handleInfoClick} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="full-pic-loading">
        <CircularProgress color="inherit" />
      </div>
    );
  }
};

export default Fullimage;
