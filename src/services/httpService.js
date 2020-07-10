import axios from "axios";

axios.defaults.headers.common["Authorization"] =
  "Client-ID Gzkvaom39nvyfxCe-NtOoH1TlVqRstOPplI2bWZVfTE";

export const callServer = async query => {
  const data = await axios.all([
    axios.get(`https://api.unsplash.com/search/photos?query=${query}`),
    axios.get(`https://api.unsplash.com/search/photos?query=${query}&page=2`),
    axios.get(`https://api.unsplash.com/search/photos?query=${query}&page=3`),
  ]);
  console.log([
    data[0].data.results,
    data[1].data.results,
    data[2].data.results,
  ]);
  return [data[0].data.results, data[1].data.results, data[2].data.results];
};
