import React from "react";

import "./notFound.scss";
import cameraIcon from "../../assets/img/camera.svg";

const Notfound = ({ history }) => {
  const handleGoHome = () => {
    history.replace("/");
  };

  return (
    <div className="not-found">
      <div className="filterr">
        <div className="brand">
          <img src={cameraIcon} alt="camera icon" />
          <p>MYSPLASH</p>
        </div>

        <h1>404</h1>

        <div className="bottom">
          <p>The page you are looking for couldn't be found</p>
          <button onClick={handleGoHome}>GO HOME</button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
