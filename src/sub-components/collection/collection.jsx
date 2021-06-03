import React, { useState } from "react";

import { getCollectionPhotos } from "../../services/httpService";

import "./collection.scss";

const Collection = React.memo(({ data, dispatchFunct }) => {
  const [httpErrors, setHttpErrors] = useState(null);

  const { preview_photos } = data;

  const handleOnClick = async () => {
    //call the server to get photos
    try {
      var pictures = await getCollectionPhotos(data.id);
    } catch (error) {
      setHttpErrors(error);
    }

    if (pictures[0].length > 0) {
      dispatchFunct({ type: "COLLECTIONS-ASKED", val: false });
      dispatchFunct({
        type: "PICTURES",
        data: [...pictures[0], ...pictures[1], ...pictures[2]],
      });
    }
  };

  if (httpErrors) throw new Error(httpErrors);
  return (
    <div className="collection" onClick={handleOnClick}>
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
