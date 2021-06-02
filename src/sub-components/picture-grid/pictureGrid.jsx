import React from "react";

import Picture from "./../picture/picture";

import "./pictureGrid.scss";

const Picturegrid = React.memo(({ pictures, history }) => {
  const amount = pictures.length / 3;

  return (
    <div id="start" className="picture-grid">
      <div className="col-one col">
        {pictures.slice(0, amount).map(picture => (
          <Picture history={history} key={picture.id} data={picture} />
        ))}
      </div>
      <div className="col-two col">
        {pictures.slice(amount, amount * 2).map(picture => (
          <Picture history={history} key={picture.id} data={picture} />
        ))}
      </div>
      <div className="col-three col">
        {pictures.slice(amount * 2).map(picture => (
          <Picture history={history} key={picture.id} data={picture} />
        ))}
      </div>
    </div>
  );
});

export default Picturegrid;
