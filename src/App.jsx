import { createBrowserRouter, RouterProvider } from "react-router"
import RootLayout from "./components/RootLayout.jsx";
import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";
import IsLogin from "./components/IsLogin.jsx";
import UserProfile from "./features/user/UserProfile.jsx";
import Dashboard from "./features/admin/Dashboard.jsx";
import ProductAddForm from "./features/admin/ProductAddForm.jsx";
import ProductEditForm from "./features/admin/ProductEditForm.jsx";
import Home from "./features/home/Home.jsx";
import ProductDetail from "./features/product/ProductDetail.jsx";
import PlaceOrder from "./features/orders/PlaceOrder.jsx";
import AdminAllordersPage from "./features/orders/AdminAllordersPage.jsx";
import SearchPage from "./features/search/SearchPage.jsx";
import OneSignal from 'react-onesignal';
import { useEffect } from "react";
import ShopPage from "./features/home/ShopPage.jsx";
import Checkout from "./features/checkout/Checkout.jsx";
import OrderPage from "./features/orders/OrderPage.jsx";
import PaymentSuccess from "./features/esewa/PaymentSucess.jsx";
import PaymentFailed from "./features/esewa/PaymentFailed.jsx";
import RequireAdminAuth from "./components/RequireAdminAuth.jsx";
import RequireUserAuth from "./components/RequireUserAuth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <IsLogin />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ]
      },
      {
        element: <RequireAdminAuth />,
        children: [
          { path: "admin-dashboard", element: <Dashboard /> },
          { path: "product-add", element: <ProductAddForm /> },
          { path: "product-edit/:id", element: <ProductEditForm /> },
          { path: "all-orders", element: <AdminAllordersPage /> },
        ]
      },
      {
        element: <RequireUserAuth />,
        children: [
          { path: "profile", element: <UserProfile /> },
          { path: "my-orders", element: <OrderPage /> },
          { path: "order-place", element: <PlaceOrder /> },
          { path: "checkout", element: <Checkout /> },
          { path: "payment-success", element: <PaymentSuccess /> },
          { path: "payment-failed", element: <PaymentFailed /> },
        ]
      },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "search", element: <SearchPage /> },
      { path: "shop", element: <ShopPage /> },
    ]
  }
]);

let oneSignalInitialized = false;

export default function App() {
  useEffect(() => {
    if (typeof window === "undefined" || oneSignalInitialized) return;
    oneSignalInitialized = true;

    OneSignal.init({
      appId: 'fe5daf53-a09d-4a94-bb5e-0541d0055f71',
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: "/OneSignalSDK.sw.js",
      notifyButton: { enable: true },
      welcomeNotification: {
        disable: false,
        title: "Welcome to ecommerce app",
        message: "Thank you for visiting my app",
      }
    }).then(() => {
      if (Notification.permission === "granted" && !localStorage.getItem("welcomed")) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Welcome to ecommerce app", {
            body: "Thank you for visiting my app",
            icon: "/icon.png",
          });
          localStorage.setItem("welcomed", "true");
        });
      } else if (Notification.permission !== "denied") {
        OneSignal.showSlidedownPrompt().then(() => {
          navigator.serviceWorker.ready.then((registration) => {
            if (Notification.permission === "granted" && !localStorage.getItem("welcomed")) {
              registration.showNotification("Welcome to ecommerce app", {
                body: "Thank you for visiting my app",
                icon: "/icon.png",
              });
              localStorage.setItem("welcomed", "true");
            }
          });
        });
      }
    });
  }, []);

  return <RouterProvider router={router} />;
}