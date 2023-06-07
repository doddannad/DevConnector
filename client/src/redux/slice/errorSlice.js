import { createSlice, nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = [];

const errorSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setError: (state, { payload }) => {
      const errors = payload.errors.map((err) => {
        const id = nanoid();
        return {
          msg: err.msg,
          id,
          type: payload.type,
        };
      });
      state.unshift(...errors);
    },
    removeError: (state, { payload }) => {
      return state.filter((err) => err.id !== payload);
    },
  },
});

export const { setError, removeError } = errorSlice.actions;

export default errorSlice.reducer;
