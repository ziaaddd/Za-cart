import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const MainLayout = lazy(() => import("./layouts/mainLayout/MainLayout"));
const Home = lazy(() => import("./pages/home/Home"));
const Products = lazy(() => import("./pages/products/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Cart = lazy(() => import("./pages/Cart"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Wishlist = lazy(() => import("./pages/WishList"));
const Register = lazy(() => import("./pages/Register"));
const LogIn = lazy(() => import("./pages/LogIn"));
const Profile = lazy(() => import("./pages/Profile"));
const ProductDetail = lazy(
  () => import("./pages/product-details/ProductDetail"),
);
const Checkout = lazy(() => import("./pages/checkout/Checkout"));
const Orders = lazy(() => import("./pages/orders/Orders"));

import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import LottiesHandler from "./components/feedback/lotties/LottiesHandler";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <Home />,
          </Suspense>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <Categories />
          </Suspense>
        ),
      },

      {
        path: "categories/products/:categoryId",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <Products />
          </Suspense>
        ),
      },
      {
        path: "categories/products/:categoryId/:productId",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <ProductDetail />
          </Suspense>
        ),
      },

      {
        path: "cart",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <Cart />
          </Suspense>
        ),
      },
      {
        path: "checkout",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "about-us",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: "wishlist",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <ProtectedRoutes>
              <Wishlist />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <Register />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <LogIn />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense
            fallback={<LottiesHandler type="loading" message="Loading..." />}
          >
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};
export default App;
