import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderSuccess: false,
  orderId: null,
  orderDetails: null,
};

const checkoutSlice = createSlice({
  name: "checkoutSlice",
  initialState,
  reducers: {
    setOrderSuccess: (state, action) => {
      state.orderSuccess = true;
      state.orderId = action.payload.orderId;
      state.orderDetails = action.payload.orderDetails;
    },
    clearOrder: (state) => {
      state.orderSuccess = false;
      state.orderId = null;
      state.orderDetails = null;
    },
  },
});

export const { setOrderSuccess, clearOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer;