import React, { useReducer, useEffect, useContext, useCallback } from "react";
import { flatten } from "../../services/helperFunctions";
import {
  getUserPhotos,
  getUserLikes,
  getUserCollections,
  getCollectionPhotos,
} from "../../services/httpService";
import CircularProgress from "@material-ui/core/CircularProgress";

import FirebaseContext from "./../../services/firebase/firebaseContext";

import HeaderProfile from "./../../sub-components/header-profile/headerProfile";
import Menu from "./../../sub-components/menu/menu";
import Picturegrid from "./../../sub-components/picture-grid/pictureGrid";
import Collection from "./../../sub-components/collection/collection";

import "./userProfile.scss";
import likeBlack from "../../assets/img/favorite-white.svg";
import likeRed from "../../assets/img/favorite-red.png";

const reducerFunction = (currState, action) => {
  switch (action.type) {
    case "MENU-ASKED":
      return { ...currState, menuAsked: action.val };
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
    pictures: [[], [], []],
    collections: [],
    collectionsAsked: false,
    currentUser: "",
    error: null,
    collectionError: null,
  };

  const [updatedState, dispatch] = useReducer(reducerFunction, initState);

  const firebaseContext = useContext(FirebaseContext);

  //I defined it here coz it will be used many times
  const username = match.params.username;

  useEffect(() => {
    let _isMounted = true;

    getUserPhotos(username).then(pictures => {
      if (_isMounted) {
        dispatch({ type: "PICTURES", data: pictures });
        dispatch({ type: "CURRENT-USER", data: pictures[0][0] });
      }
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
      dispatch({ type: "PICTURES", data: [[], [], []] });

      //updating the styles
      node.className = "links one";

      //calling the server
      const pictures = await getUserPhotos(username);
      dispatch({ type: "PICTURES", data: pictures });
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
      dispatch({ type: "PICTURES", data: [[], [], []] });

      //updating the styles
      node.className = "links two";

      //calling the server
      const pictures = await getUserLikes(username);
      if (flatten(pictures).length === 0)
        dispatch({ type: "ERROR", message: "User hasn't liked any picture!" });
      else dispatch({ type: "PICTURES", data: pictures });
    },
    [username]
  );

  const handleGetUserCollection = useCallback(
    async ({ target }) => {
      //prevent the user from calling the server without need to
      const node = target.parentNode;
      if (node.className.includes("three")) return;

      //calling the server
      const collections = await getUserCollections(username);
      if (collections.length === 0)
        dispatch({
          type: "COLLECTIONS-ERROR",
          message: "User doesn't have any collection!",
        });
      else dispatch({ type: "COLLECTIONS", data: collections });

      //updating the styles
      node.className = "links three";
      dispatch({ type: "COLLECTIONS-ASKED", val: true });
    },
    [username]
  );

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
    const pictures = await getCollectionPhotos(id);

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

  const {
    pictures,
    collectionsAsked,
    collections,
    error,
    collectionError,
    currentUser,
    menuAsked,
  } = updatedState;

  return (
    <div className="User-profile">
      {currentUser ? (
        <HeaderProfile
          showMenu={handleShowMenu}
          showSearch={handleShowSearch}
          getUserPhotos={handleGetUserPhotos}
          getUserLikes={handleGetUserLikes}
          getUserCollection={handleGetUserCollection}
          userInfo={currentUser}
        />
      ) : null}

      {/* handle nonCollection error */}
      {!error && flatten(pictures).length === 0 ? (
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
              handleOnclick={handleCollectioClick}
            />
          ))}
        </div>
      ) : null}

      {!collectionsAsked && flatten(pictures).length > 0 ? (
        <Picturegrid
          pictures={pictures}
          handlePictureClick={handlePictureClick}
          handlePictureLike={handleLike}
        />
      ) : null}

      <Menu
        menuAsked={menuAsked}
        closeMenu={closeMenuu}
        authUser={userAuth}
        singoutORsingin={singoutORsingin}
      />
    </div>
  );
};

export default Userprofile;
