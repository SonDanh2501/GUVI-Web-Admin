export const getToken = async () => {
  try {
    const jsonValue = await localStorage.getItem("access_token");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const setToken = async (token) =>
  await localStorage.setItem("access_token", JSON.stringify(token));

export const removeToken = async () => {
  try {
    await localStorage.removeItem("access_token");
  } catch (e) {
    // error reading value
  }
};
