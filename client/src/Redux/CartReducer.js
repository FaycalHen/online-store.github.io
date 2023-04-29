import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  like:[],
  current:[],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    removeItem: (state,action) => {
      state.products=state.products.filter(item=>item.id !== action.payload)
    },
    resetCart: (state) => {
      state.products = []
    },
    addToWishlist:(state, action)=>{
      const item = state.like.find((item) => item.id === action.payload.id);
      if(item){
        state.like=state.like.filter(item=>item.id !== action.payload)
      }
      else{
        state.like.push(action.payload);
      }
    },
    removeLike: (state,action) => {
      state.like=state.like.filter(item=>item.id !== action.payload)
    },
    resetLike: (state,action) => {
      state.like = []
    }, 
    addcurrent: (state, action) => {
      if (state.current.length === 0) {
        state.current.push(action.payload);
      }
    },
    
    removeuser: (state,action) => {
      state.current= []
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart,removeItem,resetCart,addToWishlist,removeLike,addcurrent,removeuser,resetLike} = cartSlice.actions;

export default cartSlice.reducer;