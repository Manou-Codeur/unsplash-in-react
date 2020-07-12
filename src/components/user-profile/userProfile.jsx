import React from "react";

import "./userProfile.scss";

const Userprofile = props => {
  return <h1>{props.match.params.username}</h1>;
};

export default Userprofile;
