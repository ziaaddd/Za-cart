import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import LottiesHandler from "./components/feedback/lotties/LottiesHandler";

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
const PaymentSuccess = lazy(() => import("./pages/checkout/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/checkout/PaymentCancel"));
const Orders = lazy(() => import("./pages/orders/Orders"));

const fallbackPage = (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "40vh" }}
  >
    <LottiesHandler type="loading" />
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={fallbackPage}>{element}</Suspense>
);

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "categories", element: withSuspense(<Categories />) },
      {
        path: "categories/products/:categoryId",
        element: withSuspense(<Products />),
      },
      {
        path: "categories/products/:categoryId/:productId",
        element: withSuspense(<ProductDetail />),
      },
      { path: "cart", element: withSuspense(<Cart />) },
      {
        path: "checkout",
        element: withSuspense(
          <ProtectedRoutes>{withSuspense(<Checkout />)}</ProtectedRoutes>,
        ),
      },
      {
        path: "checkout/success",
        element: withSuspense(
          <ProtectedRoutes>{withSuspense(<PaymentSuccess />)}</ProtectedRoutes>,
        ),
      },
      {
        path: "checkout/cancel",
        element: withSuspense(
          <ProtectedRoutes>{withSuspense(<PaymentCancel />)}</ProtectedRoutes>,
        ),
      },
      {
        path: "orders",
        element: withSuspense(
          <ProtectedRoutes>{withSuspense(<Orders />)}</ProtectedRoutes>,
        ),
      },
      { path: "about-us", element: withSuspense(<AboutUs />) },
      {
        path: "wishlist",
        element: withSuspense(
          <ProtectedRoutes>{withSuspense(<Wishlist />)}</ProtectedRoutes>,
        ),
      },
      { path: "register", element: withSuspense(<Register />) },
      { path: "login", element: withSuspense(<LogIn />) },
      {
        path: "profile",
        element: withSuspense(
          <ProtectedRoutes>{withSuspense(<Profile />)}</ProtectedRoutes>,
        ),
      },
      { path: "*", element: withSuspense(<ErrorPage />) },
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
