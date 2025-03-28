import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) :
{cartItems:[], shippingAddress:{}, paymentMethod:"Transfer", itemPrice: 0 , shippingPrice : 0 , taxPrice: 0, totalPrice:0 };


 
const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers: {
        
        addToCart: (state, action) =>{
            const item = action.payload

            const existItem = state.cartItems.find((x) => x._id === item._id );

            if(existItem){
                state.cartItems = state.cartItems.map((x) =>x._id === existItem._id ? item: x )
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            return updateCart(state, state.shippingPrice)        
         },
        removeFromCart:(state, action) => {
            state.cartItems =  state.cartItems.filter((x)=> x._id !== action.payload);

            return updateCart(state, )        
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state)        
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state)        },
        // saveItemSize:(state, action) =>{
        //     const {productId, size} = action.payload;
        //     state.size = state.items.push({productId, size})
        // },
        clearCartItems : (state, action) => {
            state.cartItems = [];
            return updateCart(state)        
        },
        resetCart: (state) => (state = initialState),
    },
})

export const {addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, resetCart } = cartSlice.actions

export default cartSlice.reducer;