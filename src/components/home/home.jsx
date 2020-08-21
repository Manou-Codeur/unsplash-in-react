import React, { useState, useContext, useEffect, useCallback } from "react";
import { callServer } from "../../services/httpService";
import { flatten } from "../../services/helperFunctions";
import CircularProgress from "@material-ui/core/CircularProgress";

import { FirebaseContext } from "./../../services/firebase/indexx";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Menu from "./../../sub-components/menu/menu";
import Search from "./../search/search";
import Picturegrid from "./../../sub-components/picture-grid/pictureGrid";

import "./home.scss";
import likeBlack from "../../assets/img/favorite-white.svg";
import likeRed from "../../assets/img/favorite-red.png";

const Home = ({ search, history, location }) => {
  //managing satate
  const [menuAsked, setMenuAsked] = useState(false);
  const [pictures, setPictures] = useState([[], [], []]);
  const [searchAsked, setSearchAsked] = useState(search);
  const [authUser, setAuthUser] = useState(null);
  const [error, setError] = useState(null);

  //context API
  const firebaseContext = useContext(FirebaseContext);

  //funct to call the server and get pictures
  const getPictures = useCallback(async () => {
    let data;
    if (window.query) {
      data = await callServer(window.query);
      if (data[0].length === 0) setError("Picture not found!");
    } else {
      data = await callServer();
    }
    return data;
  }, []);

  //component did mount
  useEffect(() => {
    let _isMounted = true;

    //auth user and firebase
    firebaseContext.isUserAuthenticated(userInfo => {
      if (userInfo && !userInfo.displayName) {
        firebaseContext.user(userInfo.uid).on("value", snapshot => {
          const usersObject = snapshot.val();
          if (usersObject) firebaseContext.updateUser(usersObject.name, null);
        });
      }
      if (_isMounted) setAuthUser(userInfo);
    });

    getPictures().then(pictures => {
      if (_isMounted) setPictures(pictures);
    });

    return () => {
      _isMounted = false;
      firebaseContext.users().off();
    };
  }, [getPictures, firebaseContext]);

  // component did update
  useEffect(() => {
    if (!search) {
      setSearchAsked(search);
    }
  }, [search]);

  const askForMenu = () => {
    setMenuAsked(true);
  };

  const closeMenu = () => {
    setMenuAsked(false);
  };

  const handlePictureClick = (data, { target }) => {
    //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
    if (!target.className.includes("heart"))
      history.push("/picture/" + data.id);
  };

  const handleSearchIconClick = () => {
    setSearchAsked(true);
    history.push("/search");
  };

  const handleCloseSearch = () => {
    setSearchAsked(false);
    const usernamee = location.pathname.split("/")[2];
    if (usernamee) history.push("/profile/" + usernamee);
    else history.push("/");
  };

  const handleSearchInput = async ({ keyCode, target }, val) => {
    //update the state
    if (keyCode === 13 && val !== "") {
      setPictures([[], [], []]);
      setError(null);
      const data = await callServer(val);
      if (data[0].length === 0) setError("Picture not found!");
      setPictures(data);
      window.query = val;
      target.value = "";
      target.focus();
    }
  };

  const handleSubscribeClick = () => {
    history.push("/singup");
  };

  const singoutORsingin = async ({ target }) => {
    if (target.textContent === "Singin") {
      history.replace("/login");
    } else {
      await firebaseContext.doSignOut();
      history.replace("/");
    }
  };

  const handleLike = ({ target }, id) => {
    if (!authUser) {
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
      firebaseContext
        .picture(authUser.uid, id)
        .set({ liked: true, likes: likes + 1 });
    } else {
      target.src = likeBlack;
      target.className = "black heart";
      nextSibling.textContent = likes - 1;

      //about db
      firebaseContext.picture(authUser.uid, id).remove();
    }
  };

  return (
    <div
      className="home"
      style={
        searchAsked ? { backgroundColor: "white" } : { backgroundColor: "" }
      }
    >
      {searchAsked ? (
        <Search
          handleCloseSearch={handleCloseSearch}
          handleSearchInput={handleSearchInput}
        />
      ) : (
        <Headerhome
          askForMenu={askForMenu}
          handleSubscribeClick={handleSubscribeClick}
          handleSearchIconClick={handleSearchIconClick}
          authUser={authUser}
        />
      )}

      {flatten(pictures).length > 0 ? (
        <Picturegrid
          pictures={pictures}
          handlePictureClick={handlePictureClick}
          handlePictureLike={handleLike}
        />
      ) : (
        <div style={{ textAlign: "center", color: "black" }}>
          {error ? <h1>{error}</h1> : <CircularProgress color="inherit" />}
        </div>
      )}

      <button className="more-btn">Load More</button>

      <Menu
        menuAsked={menuAsked}
        closeMenu={closeMenu}
        authUser={authUser}
        singoutORsingin={singoutORsingin}
      />
    </div>
  );
};

export default Home;
