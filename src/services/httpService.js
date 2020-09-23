import axios from "axios";
import React, { createContext, useState } from "react";

export const errorContext = createContext({
  error: null,
  updateError: () => {},
});

export default props => {
  const [error, setError] = useState(null);

  axios.defaults.headers.common[
    "Authorization"
  ] = `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}`;

  axios.defaults.baseURL = "https://api.unsplash.com";

  axios.interceptors.response.use(null, error => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      setError("There is an unexpected error, please reload and try again!");
    } else if (error.response && error.response.status === 403) {
      setError("Sorry there is a lot of requests, please retry later!");
    }

    return Promise.reject(error);
  });

  return (
    <errorContext.Provider
      value={{
        error,
        updateError: message => setError(message),
      }}
    >
      {props.children}
    </errorContext.Provider>
  );
};

export const callServer = async (query = ["people", "nature", "food"]) => {
  const data = await axios.all([
    axios.get(`/search/photos?query=${query.length === 3 ? query[0] : query}`),
    axios.get(
      `/search/photos?query=${
        query.length === 3 ? query[1] : query + "&page=2"
      }`
    ),
    axios.get(
      `/search/photos?query=${
        query.length === 3 ? query[2] : query + "&page=3"
      }`
    ),
  ]);
  return [data[0].data.results, data[1].data.results, data[2].data.results];
};

export const getPicture = async id => {
  const data = await axios.get(`/photos/${id}`);
  return data.data;
};

export const getUserPhotos = async username => {
  const data = await axios.all([
    axios.get(`/users/${username}/photos`),
    axios.get(`/users/${username}/photos?page=2`),
    axios.get(`/users/${username}/photos?page=3`),
  ]);
  return [data[0].data, data[1].data, data[2].data];
};

export const getUserLikes = async username => {
  const data = await axios.all([
    axios.get(`/users/${username}/likes`),
    axios.get(`/users/${username}/likes?page=2`),
    axios.get(`/users/${username}/likes?page=3`),
  ]);
  return [data[0].data, data[1].data, data[2].data];
};

export const getUserCollections = async username => {
  const data = await axios.all([
    axios.get(`/users/${username}/collections`),
    axios.get(`/users/${username}/collections?page=2`),
    axios.get(`/users/${username}/collections?page=3`),
  ]);
  return [...data[0].data, ...data[1].data, ...data[2].data];
};

export const getCollectionPhotos = async id => {
  const data = await axios.all([
    axios.get(`/collections/${id}/photos`),
    axios.get(`/collections/${id}/photos?page=2`),
    axios.get(`/collections/${id}/photos?page=3`),
  ]);
  return [data[0].data, data[1].data, data[2].data];
};

export const download = async id => {
  const { data } = await axios({
    url: `/photos/${id}/download`,
  });
  return data.url;
};
