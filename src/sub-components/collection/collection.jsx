import React from "react";

import "./collection.scss";

const Collection = ({ data, handleOnclick }) => {
  if (Object.keys(data).length > 0) {
    const { preview_photos } = data;

    return (
      <div className="collection" onClick={handleOnclick.bind(this, data.id)}>
        <div
          className="bigOne"
          style={{
            background: `url(${
              preview_photos ? preview_photos[0].urls.full : null
            })`,
            backgroundSize: "cover",
          }}
        ></div>
        {preview_photos && (
          <div className="littlesOne">
            <div
              className="first-one"
              style={{
                background: `url(${
                  preview_photos[1]
                    ? preview_photos[1].urls.full
                    : preview_photos[0].urls.full
                })`,
                backgroundSize: "cover",
              }}
            ></div>
            <div
              className="second-one"
              style={{
                background: `url(${
                  preview_photos[2]
                    ? preview_photos[2].urls.full
                    : preview_photos[0].urls.full
                })`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        )}
      </div>
    );
  } else {
    return <h1>Please wait...</h1>;
  }
};

export default Collection;
