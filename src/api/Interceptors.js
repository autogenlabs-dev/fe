import axiosInstance from "./axios";
import { setUserInfo } from "@/redux/auth/authSlice";

const setup = (store) => {
  // axiosInstance.interceptors.request.use(
  //   (config) => {

  //     const token = TokenService.getLocalAccessToken();
  //     if (token) {
  //       // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
  //       config.headers["x-access-token"] = token; // for Node.js Express back-end
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (
        originalConfig.url !== "/auth/login" &&
        originalConfig.url !== "/auth/refresh-tokens" &&
        err.response
      ) {
        if (
          err.response.status === 500 &&
          err.response.data.error === "Please authenticate" &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true;
          const { dispatch } = store;
          const state = store.getState();
          // // console.log("state", { ...state.auth.userInfo });
          const userData = localStorage.getItem("userInfo");
          const userObject = JSON.parse(userData);
          // // console.log("userObject", userObject);
          const accessToken =
            state.auth?.userInfo?.access?.token || userObject?.access?.token;
          const expiresAt =
            state.auth?.userInfo?.access?.expires ||
            userObject?.access?.expires;
          const currentTime = Date.now();
          const expiresAtNumber = Date.parse(expiresAt);
          // // console.log(" expiresAt", expiresAtNumber);
          // // console.log("currentTime", currentTime);
          try {
            if (currentTime > expiresAtNumber) {
              const refreshToken =
                state.auth?.userInfo?.refresh?.token ||
                userObject?.refresh?.token;
              // // console.log(" refreshToken", refreshToken);
              const { data } = await axiosInstance.post(
                `/auth/refresh-tokens`,
                {
                  refreshToken,
                }
              );
              // // console.log("data", data);
              localStorage.setItem("userInfo", JSON.stringify(data));
              dispatch(setUserInfo(data));
              originalConfig.headers.Authorization = `Bearer ${data.access.token}`;
              return axiosInstance(originalConfig);
            }
            localStorage.removeItem("userInfo");
            dispatch(setUserInfo(null));
            return Promise.reject(err);
          } catch (_error) {
            localStorage.removeItem("userInfo");
            dispatch(setUserInfo(null));
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};

export default setup;
