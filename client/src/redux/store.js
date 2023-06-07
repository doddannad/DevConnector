import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

// import api's #reducers
import { registerApi } from "./api";

// import slices #reducer
import errorSlice from "./slice/errorSlice";

const store = configureStore({
  reducer: {
    [registerApi.reducerPath]: registerApi.reducer,
    errors: errorSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(registerApi.middleware);
  },
});

setupListeners(store.dispatch);

export default store;
