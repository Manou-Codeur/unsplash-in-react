//this module is usefull for creating a firebase class instance only one time then sending it to the top level of our app
//so we could access it from any component
import React from "react";

const FirebaseContext = React.createContext(null);

export default FirebaseContext;
