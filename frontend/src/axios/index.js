import axios from "axios";

export const AUTH_TOKEN = "authToken";
const CLIENT = "client";
const UID = "uid";

export const axiosInstance = axios.create({
  baseURL: "https://rs-blackmarket-api.herokuapp.com/api/v1",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    const client = localStorage.getItem(CLIENT);
    const uid = localStorage.getItem(UID);
    if (token && client && uid) {
      config.headers["access-token"] = token;
      config.headers.client = client;
      config.headers.uid = uid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["access-token"];

    const uid = response.headers["uid"] || localStorage.getItem(UID);
    const client = response.headers["client"] || localStorage.getItem(CLIENT);

    if (newAccessToken) {
      localStorage.setItem(AUTH_TOKEN, newAccessToken);
      localStorage.setItem(CLIENT, client);
      localStorage.setItem(UID, uid);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      axiosInstance.defaults.headers.common["uid"] = uid;
      axiosInstance.defaults.headers.common["client"] = client;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
