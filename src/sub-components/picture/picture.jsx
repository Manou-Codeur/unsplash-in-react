import React, { useState, useContext, useRef, useEffect } from "react";

import FirebaseContext from "./../../services/firebase/firebaseContext";

import likeRed from "../../assets/img/favorite-red.png";
import likeBlack from "../../assets/img/favorite-white.svg";
import downloadIcon from "../../assets/img/download.png";
import addIcon from "../../assets/img/add.svg";
import "./picture.scss";

const Picture = ({ data, history, firebase, updatedState }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const firebaseContext = useContext(FirebaseContext);

  const picture = useRef();
  const user = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    let _isMounted = true;

    firebaseContext.isUserAuthenticated(userInfo => {
      if (userInfo) {
        firebaseContext.picture(userInfo.uid, data.id).on("value", snapshot => {
          const usersObject = snapshot.val();
          if (_isMounted && usersObject) {
            setAuthUser(userInfo);
            setLiked(usersObject.liked);
            setLikes(usersObject.likes);
          }
        });
      }
    });

    return () => {
      _isMounted = false;

      if (authUser) firebaseContext.pictures(authUser.uid).off();
    };
  }, [authUser, firebaseContext]);

  const handleHover = () => {
    controlsRef.current.className = "controls";
    user.current.className = "picture-owner";
    picture.current.className = "background";
    picture.current.style.transform = "scale(1.1)";
  };

  const handleLeave = () => {
    controlsRef.current.className = "controls hide";
    user.current.className = "picture-owner hide";
    picture.current.className = "background no-blur";
    picture.current.style.transform = "";
  };

  const handlePictureLike = ({ target }) => {
    if (!updatedState.authUser) {
      history.push("/login");
      return;
    }

    const nextSibling = target.nextElementSibling;
    const likes = parseInt(nextSibling.textContent);
    if (target.className === "black heart") {
      target.src = likeRed;
      target.className = "red heart";
      nextSibling.textContent = likes + 1;

      //about db
      firebase
        .picture(updatedState.authUser.uid, data.id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeBlack;
      target.className = "black heart";
      nextSibling.textContent = likes - 1;

      //about db
      firebase.picture(updatedState.authUser.uid, data.id).remove();
    }
  };

  const handlePictureClick = ({ target }) => {
    //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
    if (!target.className.includes("heart"))
      history.push("/picture/" + data.id);
  };

  const userPP = data.user.profile_image.large;
  return (
    <div
      className="picture"
      onClick={handlePictureClick}
      style={{
        backgroundColor: data.color,
      }}
      title={data.description}
    >
      <img
        className="background no-blur"
        src={data.urls.regular}
        alt={data.description}
        ref={picture}
      />

      <div
        className="content-containner"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <div className="picture-owner hide" ref={user}>
          <div
            className="img-containner"
            style={{ background: `url(${userPP})`, backgroundSize: "cover" }}
          ></div>
          <p className="by">Photo by</p>
          <p className="user-name">
            {data.user.first_name + " " + (data.user.last_name || "")}
          </p>
        </div>

        <div className="controls hide" ref={controlsRef}>
          <div className="imgg-containner one">
            <img
              src={liked ? likeRed : likeBlack}
              className={liked ? "red heart" : "black heart"}
              alt="heart icon"
              onClick={handlePictureLike}
            />
            <p>{likes ? likes : data.likes}</p>
          </div>
          <div className="imgg-containner">
            <img className="test" src={addIcon} alt="plus icon" />
          </div>
          <div className="imgg-containner">
            <img src={downloadIcon} alt="download icon" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Picture;
