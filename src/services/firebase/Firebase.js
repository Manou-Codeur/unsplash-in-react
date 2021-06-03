import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

class Firebase {
  constructor() {
    //init firebase config
    app.initializeApp(config);

    //init firebase auth method so we could use all it's functions
    this.auth = app.auth();

    //init firebase auth method so we could use all it's functions
    this.db = app.database();

    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  //auth methods
  //method to create new user
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  //method to singin a user
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  //method to singin a user with facebook
  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  //method to singout a user
  doSignOut = () => this.auth.signOut();

  //method to get user data if he is authenticated
  isUserAuthenticated = funct => this.auth.onAuthStateChanged(funct);

  //get current user info
  deleteUser = () => {
    this.auth.currentUser.delete();
  };

  //method to update the userprofile
  updateUser = (username, pp) => {
    this.auth.currentUser.updateProfile({
      displayName: username,
      photoURL: pp,
    });
  };

  //db methods
  users = () => this.db.ref("users");
  user = uid => this.db.ref(`users/${uid}`);

  pictures = uid => this.db.ref(`users/${uid}/pictures`);
  picture = (uid, id) => this.db.ref(`users/${uid}/pictures/${id}`);
}

export default Firebase;
