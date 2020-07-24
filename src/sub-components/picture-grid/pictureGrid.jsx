import React from "react";

import Picture from "./../picture/picture";

import "./pictureGrid.scss";

const Picturegrid = ({
  pictures,
  handlePictureClick,
  handlePictureLike,
  loggedOut,
}) => {
  return (
    <div className="picture-grid">
      <div className="col-one col">
        {pictures[0].map(picture => (
          <Picture
            handlePictureClick={handlePictureClick}
            handlePictureLike={handlePictureLike}
            loggedOut={loggedOut}
            key={picture.id}
            data={picture}
          />
        ))}
      </div>
      <div className="col-two col">
        {pictures[1].map(picture => (
          <Picture
            handlePictureClick={handlePictureClick}
            handlePictureLike={handlePictureLike}
            loggedOut={loggedOut}
            key={picture.id}
            data={picture}
          />
        ))}
      </div>
      <div className="col-three col">
        {pictures[2].map(picture => (
          <Picture
            handlePictureClick={handlePictureClick}
            handlePictureLike={handlePictureLike}
            loggedOut={loggedOut}
            key={picture.id}
            data={picture}
          />
        ))}
      </div>
    </div>
  );
};

export default Picturegrid;
