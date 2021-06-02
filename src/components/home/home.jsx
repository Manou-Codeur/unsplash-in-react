import React, {
  useContext,
  useEffect,
  useCallback,
  useReducer,
  useState,
} from "react";
import { callServer } from "../../services/httpService";
import CircularProgress from "@material-ui/core/CircularProgress";

import { FirebaseContext } from "./../../services/firebase/indexx";

import Headerhome from "./../../sub-components/header-home/headerHome";
import Menu from "./../../sub-components/menu/menu";
import Search from "./../search/search";
import Picturegrid from "./../../sub-components/picture-grid/pictureGrid";

import "./home.scss";

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

const Home = ({ history }) => {
  const initState = {
    menuAsked: false,
    pictures: [],
    searchAsked: false,
    authUser: null,
    error: null,
  };

  const [updatedState, dispatch] = useReducer(reducerFunct, initState);

  //context API
  const firebase = useContext(FirebaseContext);

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
    firebase.isUserAuthenticated(userInfo => {
      if (userInfo && !userInfo.displayName) {
        firebase.user(userInfo.uid).on("value", snapshot => {
          const usersObject = snapshot.val();
          if (usersObject) firebase.updateUser(usersObject.name, null);
        });
      }
      if (_isMounted) dispatch({ type: "AUTH-USER", userInfo: userInfo });
    });

    getPictures().then(pictures => {
      if (_isMounted)
        dispatch({
          type: "PICTURES",
          data: [...pictures[0], ...pictures[1], ...pictures[2]],
        });
    });

    return () => {
      _isMounted = false;
      firebase.users().off();
    };
  }, [getPictures, firebase]);

  const { searchAsked, authUser, pictures, error, menuAsked } = updatedState;

  return (
    <div
      className="home"
      style={
        searchAsked ? { backgroundColor: "white" } : { backgroundColor: "" }
      }
    >
      {searchAsked ? (
        <Search dispatchFunct={dispatch} />
      ) : (
        <Headerhome
          dispatchFunct={dispatch}
          history={history}
          authUser={authUser}
        />
      )}

      {pictures.length > 0 ? (
        <Picturegrid pictures={pictures} history={history} />
      ) : (
        <div style={{ textAlign: "center", color: "black" }}>
          {error ? <h1>{error}</h1> : <CircularProgress color="inherit" />}
        </div>
      )}

      <button className="more-btn">Load More</button>

      <Menu
        dispatchFunct={dispatch}
        menuAsked={menuAsked}
        authUser={menuAsked ? authUser : null}
        firebase={firebase}
        history={history}
      />
    </div>
  );
};

export default Home;
