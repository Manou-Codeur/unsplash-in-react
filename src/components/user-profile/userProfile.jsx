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
<<<<<<< HEAD
  getCollectionPhotos,
  errorContext,
=======
>>>>>>> hooks-version-2
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

<<<<<<< HEAD
  const firebaseContext = useContext(FirebaseContext);
  const myErrorContext = useContext(errorContext);
=======
  const firebase = useContext(FirebaseContext);
>>>>>>> hooks-version-2

  //I defined username here coz it will be used many times
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
    if (myErrorContext.error) {
      dispatch({ type: "ERROR", message: myErrorContext.error });
      dispatch({ type: "PICTURES", data: [[], [], []] });
    }
  }, [myErrorContext]);

  useEffect(() => {
    let _isMounted = true;

    getUserPhotos(username)
      .then(pictures => {
        if (_isMounted) {
<<<<<<< HEAD
          dispatch({ type: "PICTURES", data: pictures });
          dispatch({ type: "CURRENT-USER", data: pictures[0][0] });
        }
      })
      .catch(err => dispatch({ type: "ERROR", message: "Network Error!" }));
=======
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
>>>>>>> hooks-version-2

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
<<<<<<< HEAD
        dispatch({ type: "PICTURES", data: pictures });
      } catch (error) {
        dispatch({ type: "ERROR", message: "Network Error!" });
=======
        dispatch({
          type: "PICTURES",
          data: [...pictures[0], ...pictures[1], ...pictures[2]],
        });
      } catch (error) {
        setHttpErrors(error);
>>>>>>> hooks-version-2
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
<<<<<<< HEAD
        if (flatten(pictures).length === 0)
=======
        if (pictures.length === 0)
>>>>>>> hooks-version-2
          dispatch({
            type: "ERROR",
            message: "User hasn't liked any picture!",
          });
<<<<<<< HEAD
        else dispatch({ type: "PICTURES", data: pictures });
      } catch (error) {
        dispatch({ type: "ERROR", message: "Network Error!" });
=======
        else
          dispatch({
            type: "PICTURES",
            data: [...pictures[0], ...pictures[1], ...pictures[2]],
          });
      } catch (error) {
        setHttpErrors(error);
>>>>>>> hooks-version-2
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
<<<<<<< HEAD
            message: "User doesn't have any collection!",
          });
        else dispatch({ type: "COLLECTIONS", data: collections });
      } catch (error) {
        dispatch({ type: "ERROR", message: "Network Error!" });
=======
            message: "User doesn't has any collection!",
          });
        else dispatch({ type: "COLLECTIONS", data: collections });
      } catch (error) {
        setHttpErrors(error);
>>>>>>> hooks-version-2
      }

      //updating the styles
      node.className = "links three";
      dispatch({ type: "COLLECTIONS-ASKED", val: true });
    },
    [username]
  );

<<<<<<< HEAD
  const closeMenuu = useCallback(() => {
    dispatch({ type: "MENU-ASKED", val: false });
  }, []);

  const handleShowMenu = useCallback(() => {
    dispatch({ type: "MENU-ASKED", val: true });
  }, []);

  const handleShowSearch = useCallback(() => {
    history.push("/search/" + username);
  }, [history, username]);

  const handlePictureClick = useCallback(
    (data, { target }) => {
      //redirect the user to the full picture page if he clicks in the picture card but not at the heart btn
      if (!target.className.includes("heart"))
        history.push("/picture/" + data.id);
    },
    [history]
  );

  const handleCollectioClick = useCallback(async id => {
    //call the server to get photos
    try {
      var pictures = await getCollectionPhotos(id);
    } catch (error) {
      console.log("there is a fuckign net error");
      dispatch({ type: "ERROR", message: "Network Error!" });
    }
    if (flatten(pictures).length > 0) {
      dispatch({ type: "COLLECTIONS-ASKED", val: false });
      dispatch({ type: "PICTURES", data: pictures });
    }
  }, []);

  const singoutORsingin = useCallback(
    async ({ target }) => {
      if (target.textContent === "Singin") {
        history.replace("/login");
      } else {
        await firebaseContext.doSignOut();
        history.replace("/");
      }
    },
    [history, firebaseContext]
  );

  const handleLike = useCallback(
    ({ target }, id) => {
      const nextSibling = target.nextElementSibling;
      const likes = parseInt(nextSibling.textContent);
      if (target.className === "black heart") {
        target.src = likeRed;
        target.className = "red heart";
        nextSibling.textContent = likes + 1;

        //about db
        firebaseContext
          .picture(userAuth.uid, id)
          .set({ liked: true, likes: likes + 1 });
      } else {
        target.src = likeBlack;
        target.className = "black heart";
        nextSibling.textContent = likes - 1;

        //about db
        firebaseContext.picture(userAuth.uid, id).remove();
      }
    },
    [firebaseContext, userAuth]
  );

=======
>>>>>>> hooks-version-2
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
