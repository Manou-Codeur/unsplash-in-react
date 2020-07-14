import axios from "axios";

axios.defaults.headers.common["Authorization"] =
  "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE";

export const callServer = async (query = ["people", "nature", "food"]) => {
  if (query.length === 3) {
    const data = await axios.all([
      axios.get(`https://api.unsplash.com/search/photos?query=${query[0]}`),
      axios.get(`https://api.unsplash.com/search/photos?query=${query[1]}`),
      axios.get(`https://api.unsplash.com/search/photos?query=${query[2]}`),
    ]);
    return [data[0].data.results, data[1].data.results, data[2].data.results];
  } else {
    const data = await axios.all([
      axios.get(`https://api.unsplash.com/search/photos?query=${query}`),
      axios.get(`https://api.unsplash.com/search/photos?query=${query}&page=2`),
      axios.get(`https://api.unsplash.com/search/photos?query=${query}&page=3`),
    ]);
    return [data[0].data.results, data[1].data.results, data[2].data.results];
  }
};

export const getUserPhotos = async username => {
  const data = await axios.all([
    axios.get(`https://api.unsplash.com/users/${username}/photos`),
    axios.get(`https://api.unsplash.com/users/${username}/photos?page=2`),
    axios.get(`https://api.unsplash.com/users/${username}/photos?page=3`),
  ]);
  return [data[0].data, data[1].data, data[2].data];
};

export const download = async id => {
  const { data } = await axios({
    url: `https://api.unsplash.com/photos/${id}/download`,
  });
  return data.url;
};
