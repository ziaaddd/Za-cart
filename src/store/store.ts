import { configureStore, combineReducers } from "@reduxjs/toolkit";
import categories from "./categories/CategoriesSlice";
import products from "./products/ProductsSlice";
import cart from "./cart/CartSlice";
import wishlist from "./wishlist/WishListSlice";
import auth from "./auth/AuthSlice";
import orders from "./orders/OrdersSlice";
import payment from "./payment/PaymentSlice";

const rootReducer = combineReducers({
  categories,
  products,
  cart,
  wishlist,
  auth,
  orders,
  payment,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
