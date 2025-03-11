const getSocketData = () => {
  return JSON.parse(localStorage.getItem("socket-data") || "{}");
};

const getUserId = () => {
  const data = getSocketData();
  return data?.userId;
};

const setUserId = (userId: string) => {
  const data = getSocketData() || {};
  data.userId = userId;
  return localStorage.setItem("socket-data", JSON.stringify(data));
};

export { getSocketData, getUserId, setUserId };
