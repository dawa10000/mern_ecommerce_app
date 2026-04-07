import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./mainApi.js";
import { userSlice } from "../features/user/userSlice.js";
import { cartSlice } from "../features/carts/cartSlice.js";
import checkoutReducer from "../features/checkout/checkoutSlice.js";




export const store = configureStore({
  reducer: {
    [cartSlice.name]: cartSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    checkoutSlice: checkoutReducer,
    [mainApi.reducerPath]: mainApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(mainApi.middleware)
})