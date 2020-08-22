import React, { useContext, useEffect, useCallback, useReducer } from "react";
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

const reducerFunct = (currState, action) => {
  switch (action.type) {
    case "MENU-ASKED":
      return { ...currState, menuAsked: action.val };
    case "PICTURES":
      return { ...currState, pictures: action.data };
    case "SEARCH-ASKED":
      return { ...currState, searchAsked: action.val };
    case "AUTH-USER":
      return { ...currState, authUser: action.userInfo };
    case "ERROR":
      return { ...currState, error: action.message };

    default:
      throw new Error("shouldn't get here");
  }
};

const Home = ({ search, history, location }) => {
  const initState = {
    menuAsked: false,
    pictures: [[], [], []],
    searchAsked: search,
    authUser: null,
    error: null,
  };

  const [updatedState, dispatch] = useReducer(reducerFunct, initState);

  //context API
  const firebaseContext = useContext(FirebaseContext);

  //funct to call the server and get pictures
  const getPictures = useCallback(async () => {
    let data;
    if (window.query) {
      data = await callServer(window.query);
      if (data[0].length === 0)
        dispatch({ type: "ERROR", message: "Picture not found!" });
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
      if (_isMounted) dispatch({ type: "AUTH-USER", userInfo: userInfo });
    });

    getPictures().then(pictures => {
      if (_isMounted) dispatch({ type: "PICTURES", data: pictures });
    });

    return () => {
      _isMounted = false;
      firebaseContext.users().off();
    };
  }, [getPictures, firebaseContext]);

  // component did update
  useEffect(() => {
    if (!search) {
      dispatch({ type: "SEARCH-ASKED", val: search });
    }
  }, [search]);

  const askForMenu = useCallback(() => {
    dispatch({ type: "MENU-ASKED", val: true });
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({ type: "MENU-ASKED", val: false });
  }, []);

  const handlePictureClick = useCallback(
    (data, { target }) => {
      //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
      if (!target.className.includes("heart"))
        history.push("/picture/" + data.id);
    },
    [history]
  );

  const handleSearchIconClick = useCallback(() => {
    dispatch({ type: "SEARCH-ASKED", val: true });
    history.push("/search");
  }, [history]);

  const handleCloseSearch = () => {
    dispatch({ type: "SEARCH-ASKED", val: false });

    const usernamee = location.pathname.split("/")[2];
    if (usernamee) history.push("/profile/" + usernamee);
    else history.push("/");
  };

  const handleSearchInput = async ({ keyCode, target }, val) => {
    //update the state
    if (keyCode === 13 && val !== "") {
      dispatch({ type: "PICTURES", data: [[], [], []] });
      dispatch({ type: "ERROR", message: null });
      const data = await callServer(val);
      if (data[0].length === 0)
        dispatch({ type: "ERROR", message: "Picture not found!" });
      dispatch({ type: "PICTURES", data: data });
      window.query = val;
      target.value = "";
      target.focus();
    }
  };

  const handleSubscribeClick = useCallback(() => {
    history.push("/singup");
  }, [history]);

  const singoutORsingin = useCallback(
    async ({ target }) => {
      if (target.textContent === "Singin") {
        history.replace("/login");
      } else {
        await firebaseContext.doSignOut();
        history.replace("/");
      }
    },
    [firebaseContext, history]
  );

  const handleLike = useCallback(
    ({ target }, id) => {
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
        firebaseContext
          .picture(updatedState.authUser.uid, id)
          .set({ liked: true, likes: likes + 1 });
      } else {
        target.src = likeBlack;
        target.className = "black heart";
        nextSibling.textContent = likes - 1;

        //about db
        firebaseContext.picture(updatedState.authUser.uid, id).remove();
      }
    },
    [firebaseContext, history, updatedState.authUser]
  );

  return (
    <div
      className="home"
      style={
        updatedState.searchAsked
          ? { backgroundColor: "white" }
          : { backgroundColor: "" }
      }
    >
      {updatedState.searchAsked ? (
        <Search
          handleCloseSearch={handleCloseSearch}
          handleSearchInput={handleSearchInput}
        />
      ) : (
        <Headerhome
          askForMenu={askForMenu}
          handleSubscribeClick={handleSubscribeClick}
          handleSearchIconClick={handleSearchIconClick}
          authUser={updatedState.authUser}
        />
      )}

      {flatten(updatedState.pictures).length > 0 ? (
        <Picturegrid
          pictures={updatedState.pictures}
          handlePictureClick={handlePictureClick}
          handlePictureLike={handleLike}
        />
      ) : (
        <div style={{ textAlign: "center", color: "black" }}>
          {updatedState.error ? (
            <h1>{updatedState.error}</h1>
          ) : (
            <CircularProgress color="inherit" />
          )}
        </div>
      )}

      <button className="more-btn">Load More</button>

      <Menu
        menuAsked={updatedState.menuAsked}
        closeMenu={closeMenu}
        authUser={updatedState.menuAsked ? updatedState.authUser : null}
        singoutORsingin={singoutORsingin}
      />
    </div>
  );
};

export default Home;
