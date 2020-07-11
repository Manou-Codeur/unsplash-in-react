export const formatDate = input => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const arr = input.split("-");
  return `${months[arr[1] - 1]} ${arr[2]}, ${arr[0]}`;
};

export const getCamera = () => {
  const cameras = ["FujiFilm", "Canon D80", "Nikon Z50", "Sony A6100"];
  return cameras[Math.floor(Math.random() * 4)];
};
