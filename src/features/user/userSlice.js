import { createSlice } from "@reduxjs/toolkit";
import { getUserFromLocal, removeUserFromLocal, setUserToLocal } from "../local/local.js";





export const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    user: getUserFromLocal()
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      setUserToLocal(state.user);
    },
    removeUser: (state) => {
      state.user = null;
      removeUserFromLocal();

    }
  }
});

export const { setUser, removeUser } = userSlice.actions;