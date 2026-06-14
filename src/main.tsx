import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { actGetSession } from "./store/auth/actAuthLogIn.ts";
import { actLoadCartFromServer } from "./store/cart/actSyncCart.ts";
import actGetLikedProducts from "./store/wishlist/actGetLikedProducts.ts";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Toaster } from "react-hot-toast";

store.dispatch(actGetSession()).then(() => {
  const { token } = store.getState().auth;
  if (token) {
    store.dispatch(actLoadCartFromServer());
    store.dispatch(actGetLikedProducts("productsIds"));
  }
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" />
    </Provider>
  </ThemeProvider>,
);
