import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyDNEQsO4hgfxQs9FlkaduurXppNKeFNaGA",
  authDomain: "myspash-18bb4.firebaseapp.com",
  databaseURL: "https://myspash-18bb4.firebaseio.com",
  projectId: "myspash-18bb4",
  storageBucket: "myspash-18bb4.appspot.com",
  messagingSenderId: "841099794065",
  appId: "1:841099794065:web:16feb6fe7776030a7d1130",
  measurementId: "G-RBVJ8VHWBT",
};

class Firebase {
  constructor() {
    //init firebase configg
    app.initializeApp(config);

    //init firebase auth method so we could use all it's functions
    this.auth = app.auth();

    //init firebase auth method so we could use all it's functions
    this.db = app.database();

    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  //auth methods
  //method to create new user
  doCreateUserWithEmailAndPassword = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  //method to singin a user
  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  //method to singin a user with facebook
  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  //method to singout a user
  doSignOut = () => {
    return this.auth.signOut();
  };

  //method to get user data if he is authenticated
  isUserAuthenticated = funct => {
    return this.auth.onAuthStateChanged(funct);
  };

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
