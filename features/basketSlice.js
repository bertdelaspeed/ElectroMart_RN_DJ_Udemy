import { createSlice } from "@reduxjs/toolkit";

export const basketSlice = createSlice({
  name: "basket",
  initialState: {
    items: [],
    totalPrice: 0,
  },
  reducers: {
    addToBasket: (state, action) => {
      const { id, image, name, convertedPrice } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += 1;
      } else {
        state.items.push({ id, image, name, convertedPrice, quantity: 1 });
      }
      state.totalPrice += convertedPrice;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const itemIndex = state.items.findIndex((item) => item.id === id);
      state.items[itemIndex].quantity = quantity;
    },

    updateTotalPrice: (state, action) => {
      state.totalPrice += action.payload;
    },

    removeFromBasket: (state, action) => {
      const { id, convertedPrice, quantity } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalPrice -= convertedPrice * quantity;
    },
    clearBasket: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToBasket,
  removeFromBasket,
  updateQuantity,
  updateTotalPrice,
  clearBasket,
} = basketSlice.actions;

export default basketSlice.reducer;
