import { createSlice } from "@reduxjs/toolkit";
import { getCartsFromLocal, setCartsToLocal } from "../local/local.js";


export const cartSlice = createSlice({
  name: 'cartSlice',
  initialState: {
    cart: getCartsFromLocal()
  },
  reducers: {
    setCart: (state, action) => {
      const isExist = state.cart.find(item => item.id === action.payload.id);
      if (isExist) {
        state.cart = state.cart.map(item => item.id === action.payload.id ? action.payload : item);
        setCartsToLocal(state.cart);
      } else {

        state.cart.push(action.payload);
        setCartsToLocal(state.cart);

      }
    },
    removeSingle: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
      setCartsToLocal(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      setCartsToLocal(state.cart);
    }
  }
});


export const { setCart, removeSingle, clearCart } = cartSlice.actions;
