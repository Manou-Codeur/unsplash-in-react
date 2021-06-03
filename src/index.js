import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import App from "./App";
import Firebase, { FirebaseContext } from "./services/firebase/indexx";
<<<<<<< HEAD
import ErrorContext from "./services/httpService";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorContext>
        <FirebaseContext.Provider value={new Firebase()}>
          <App />
        </FirebaseContext.Provider>
      </ErrorContext>
    </BrowserRouter>
  </React.StrictMode>,
=======
import FetchError from "./errorBoundaries/fetchErrors";

import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <FirebaseContext.Provider value={new Firebase()}>
      <FetchError>
        <App />
      </FetchError>
    </FirebaseContext.Provider>
  </BrowserRouter>,
>>>>>>> hooks-version-2
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
