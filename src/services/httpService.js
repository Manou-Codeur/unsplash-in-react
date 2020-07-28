import axios from "axios";

axios.defaults.headers.common["Authorization"] =
  "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE";

axios.defaults.baseURL = "https://api.unsplash.com";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    alert("There is an unexpected error, please reload and try again!");
  } else if (error.response && error.response.status === 403)
    alert("Sorry there is a lot of requests, please retry later!");

  return Promise.reject(error);
});

export const callServer = async (query = ["people", "nature", "food"]) => {
  if (query.length === 3) {
    const data = await axios.all([
      axios.get(`/search/photos?query=${query[0]}`),
      axios.get(`/search/photos?query=${query[1]}`),
      axios.get(`/search/photos?query=${query[2]}`),
    ]);
    return [data[0].data.results, data[1].data.results, data[2].data.results];
  } else {
    const data = await axios.all([
      axios.get(`/search/photos?query=${query}`),
      axios.get(`/search/photos?query=${query}&page=2`),
      axios.get(`/search/photos?query=${query}&page=3`),
    ]);
    return [data[0].data.results, data[1].data.results, data[2].data.results];
  }
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
