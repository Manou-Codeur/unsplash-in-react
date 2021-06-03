import React, {
  useReducer,
  useEffect,
  useContext,
  useCallback,
  useState,
} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  getUserPhotos,
  getUserLikes,
  getUserCollections,
} from "../../services/httpService";

import Search from "./../search/search";
import FirebaseContext from "./../../services/firebase/firebaseContext";
import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Menu from "./../../sub-components/menu/menu";
import Picturegrid from "./../../sub-components/picture-grid/pictureGrid";
import Collection from "./../../sub-components/collection/collection";

import "./userProfile.scss";

const reducerFunction = (currState, action) => {
  switch (action.type) {
    case "MENU-ASKED":
      return { ...currState, menuAsked: action.val };
    case "SEARCH-ASKED":
      return { ...currState, searchAsked: action.val };
    case "PICTURES":
      return { ...currState, pictures: action.data };
    case "ERROR":
      return { ...currState, error: action.message };
    case "COLLECTIONS":
      return { ...currState, collections: action.data };
    case "COLLECTIONS-ASKED":
      return { ...currState, collectionsAsked: action.val };
    case "CURRENT-USER":
      return { ...currState, currentUser: action.data };
    case "COLLECTIONS-ERROR":
      return { ...currState, collectionError: action.message };
    default:
      throw new Error("Shouldn't get here");
  }
};

const Userprofile = ({ match, history, userAuth }) => {
  const initState = {
    menuAsked: false,
    searchAsked: false,
    pictures: [],
    collections: [],
    collectionsAsked: false,
    currentUser: null,
    error: null,
    collectionError: null,
  };
  const [httpErrors, setHttpErrors] = useState(null);

  const [updatedState, dispatch] = useReducer(reducerFunction, initState);

  const firebase = useContext(FirebaseContext);

  //I defined it here coz it will be used many times
  const username = match.params.username;

  //cleanup for memory leak reason
  useEffect(() => {
    return () => {
      dispatch({
        type: "PICTURES",
        data: [],
      });
      dispatch({ type: "CURRENT-USER", data: null });
      dispatch({
        type: "ERROR",
        message: null,
      });
      dispatch({ type: "COLLECTIONS", data: [] });
      dispatch({ type: "COLLECTIONS-ERROR", data: null });
    };
  }, []);

  useEffect(() => {
    let _isMounted = true;

    getUserPhotos(username)
      .then(pictures => {
        if (_isMounted) {
          dispatch({
            type: "PICTURES",
            data: [...pictures[0], ...pictures[1], ...pictures[2]],
          });
          dispatch({ type: "CURRENT-USER", data: pictures[0][0] });
        }
      })
      .catch(err => {
        setHttpErrors(err);
      });

    return () => {
      _isMounted = false;
    };
  }, [username]);

  const handleGetUserPhotos = useCallback(
    async ({ target }) => {
      //prevent the user from calling the server without need to
      const node = target.parentNode;
      if (node.className.includes("one")) return;

      //init some state props
      dispatch({ type: "COLLECTIONS-ASKED", val: false });
      dispatch({ type: "PICTURES", data: [] });

      //updating the styles
      node.className = "links one";

      //calling the server
      try {
        const pictures = await getUserPhotos(username);
        dispatch({
          type: "PICTURES",
          data: [...pictures[0], ...pictures[1], ...pictures[2]],
        });
      } catch (error) {
        setHttpErrors(error);
      }
    },
    [username]
  );

  const handleGetUserLikes = useCallback(
    async ({ target }) => {
      //prevent the user from calling the server without need to
      const node = target.parentNode;
      if (node.className.includes("two")) return;

      //init some state props
      dispatch({ type: "COLLECTIONS-ASKED", val: false });
      dispatch({ type: "PICTURES", data: [] });

      //updating the styles
      node.className = "links two";

      //calling the server
      try {
        const pictures = await getUserLikes(username);
        if (pictures.length === 0)
          dispatch({
            type: "ERROR",
            message: "User hasn't liked any picture!",
          });
        else
          dispatch({
            type: "PICTURES",
            data: [...pictures[0], ...pictures[1], ...pictures[2]],
          });
      } catch (error) {
        setHttpErrors(error);
      }
    },
    [username]
  );

  const handleGetUserCollection = useCallback(
    async ({ target }) => {
      //prevent the user from calling the server without need to
      const node = target.parentNode;
      if (node.className.includes("three")) return;

      //calling the server
      try {
        const collections = await getUserCollections(username);
        if (collections.length === 0)
          dispatch({
            type: "COLLECTIONS-ERROR",
            message: "User doesn't has any collection!",
          });
        else dispatch({ type: "COLLECTIONS", data: collections });
      } catch (error) {
        setHttpErrors(error);
      }

      //updating the styles
      node.className = "links three";
      dispatch({ type: "COLLECTIONS-ASKED", val: true });
    },
    [username]
  );

  const {
    pictures,
    searchAsked,
    collectionsAsked,
    collections,
    error,
    collectionError,
    currentUser,
    menuAsked,
  } = updatedState;

  if (httpErrors) throw new Error(httpErrors);
  return (
    <div
      className="User-profile"
      style={
        searchAsked ? { backgroundColor: "white" } : { backgroundColor: "" }
      }
    >
      {searchAsked ? (
        <Search dispatchFunct={dispatch} extraProps={handleGetUserPhotos} />
      ) : (
        <HeaderProfile
          dispatchFunct={dispatch}
          getUserPhotos={handleGetUserPhotos}
          getUserLikes={handleGetUserLikes}
          getUserCollection={handleGetUserCollection}
          userInfo={currentUser}
        />
      )}

      {/* handle nonCollection error */}
      {!error && pictures.length === 0 ? (
        <div style={{ textAlign: "center", color: "black" }}>
          <CircularProgress color="inherit" />
        </div>
      ) : null}

      {!collectionsAsked && error ? (
        <h1 style={{ textAlign: "center" }}>{error}</h1>
      ) : null}

      {/* handle collection error */}
      {collectionsAsked && !collectionError && collections.length === 0 ? (
        <div style={{ textAlign: "center", color: "black" }}>
          <CircularProgress color="inherit" />
        </div>
      ) : null}

      {collectionsAsked && collectionError ? (
        <h1 style={{ textAlign: "center" }}>{collectionError}</h1>
      ) : null}

      {collectionsAsked ? (
        <div className="collection-grid">
          {collections.map(collection => (
            <Collection
              key={collection.id}
              data={collection}
              dispatchFunct={dispatch}
            />
          ))}
        </div>
      ) : null}

      {!collectionsAsked && pictures.length > 0 ? (
        <Picturegrid pictures={pictures} history={history} />
      ) : null}

      <Menu
        menuAsked={menuAsked}
        authUser={userAuth}
        dispatchFunct={dispatch}
        history={history}
        firebase={firebase}
      />
    </div>
  );
};

export default Userprofile;
