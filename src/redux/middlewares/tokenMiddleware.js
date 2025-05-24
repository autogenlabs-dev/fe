import { refreshTokens } from "../auth/authThunk";
import { isRejectedWithValue } from "@reduxjs/toolkit";

const jwtTokenRefresher = (store) => (next) => async (action) => {
  // console.log("typeof action", typeof action, action);
  const state = store.getState();
  // console.log("state", {...state.auth.userInfo});
  if (action && isRejectedWithValue(action)) {
    if (action.payload.error === "Please authenticate") {
      const userData = localStorage.getItem("userInfo");
      const userObject = JSON.parse(userData);
      // // console.log("userObject", userObject);

      const accessToken =
        state.auth?.userInfo?.access?.token || userObject?.access?.token;
      const expiresAt =
        state.auth?.userInfo?.access?.expires || userObject?.access?.expires;
      const currentTime = Date.now() + 20000000;
      const expiresAtNumber = Date.parse(expiresAt);

      // console.log(" expiresAt", expiresAtNumber);
      // console.log("currentTime", currentTime);
      if (currentTime > expiresAtNumber) {
        const refreshToken =
        state.auth?.userInfo?.refresh?.token || userObject?.refresh?.token;
        await store.dispatch(refreshTokens({ refreshToken }));
      }
      return next(action);
    }
    return next(action);
  }
  return next(action);
};

export default jwtTokenRefresher;
