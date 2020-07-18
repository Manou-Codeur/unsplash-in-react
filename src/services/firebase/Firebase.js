import app from "firebase/app";
import "firebase/auth";

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
    //init firebase config
    app.initializeApp(config);

    //init firebase auth method so we could use all it's functions
    this.auth = app.auth();

    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  //method to create new user
  doCreateUserWithEmailAndPassword = async (email, password) => {
    await this.auth.createUserWithEmailAndPassword(email, password);
  };

  //method to singin a user
  doSignInWithEmailAndPassword = async (email, password) => {
    await this.auth.signInWithEmailAndPassword(email, password);
  };

  //method de singin a user with facebook
  doSignInWithFacebook = async () =>
    await this.auth.signInWithPopup(this.facebookProvider);

  //method to singout a user
  doSignOut = async () => {
    await this.auth.signOut();
  };

  //method to get user data if he is authenticated
  isUserAuthenticated = funct => {
    this.auth.onAuthStateChanged(funct);
  };

  //method to reset a user password
  doPasswordReset = async email =>
    await this.auth.sendPasswordResetEmail(email);

  //methode to update user password
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;
