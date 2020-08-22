import React from "react";

import "./collection.scss";

const Collection = React.memo(({ data, handleOnclick }) => {
  const { preview_photos } = data;

  return (
    <div className="collection" onClick={handleOnclick.bind(this, data.id)}>
      {preview_photos ? (
        <React.Fragment>
          <div
            className="bigOne"
            style={{
              background: `url(${preview_photos[0].urls.regular})`,
              backgroundSize: "cover",
            }}
          ></div>

          <div className="littlesOne">
            <div
              className="first-one"
              style={{
                background: `url(${
                  preview_photos[1]
                    ? preview_photos[1].urls.regular
                    : preview_photos[0].urls.regular
                })`,
                backgroundSize: "cover",
              }}
            ></div>

            <div
              className="second-one"
              style={{
                background: `url(${
                  preview_photos[2]
                    ? preview_photos[2].urls.regular
                    : preview_photos[0].urls.regular
                })`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </React.Fragment>
      ) : (
        <p>No images preview</p>
      )}
    </div>
  );
});

export default Collection;
