import React from "react";

import { getCollectionPhotos } from "../../services/httpService";
import { flatten } from "./../../services/helperFunctions";

import "./collection.scss";

const Collection = React.memo(({ data, dispatchFunct }) => {
  const { preview_photos } = data;

  const handleOnClick = async () => {
    //call the server to get photos
    const pictures = await getCollectionPhotos(data.id);

    if (flatten(pictures).length > 0) {
      dispatchFunct({ type: "COLLECTIONS-ASKED", val: false });
      dispatchFunct({ type: "PICTURES", data: pictures });
    }
  };

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
