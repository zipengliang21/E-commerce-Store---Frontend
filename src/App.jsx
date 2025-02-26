import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserData from "./views/plugin/UserData";
import CartID from "./views/plugin/CardID";
import apiInstance from "./utils/axios";

import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Dashboard from "./views/auth/Dashboard";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import MainWrapper from "./layout/MainWrapper";
import Products from "./views/store/Products";
import ProductDetail from "./views/store/ProductDetail";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import Search from "./views/store/Search";
import { CartContext } from "./views/plugin/Context";
import Account from "./views/customer/Account";
import PrivateRoute from "./layout/PrivateRoute";
import Orders from "./views/customer/Orders";
import OrderDetail from "./views/customer/OrderDetail";
import Wishlist from "./views/customer/Wishlist";
import Notification from "./views/customer/Notifications";

function App() {
  const [cartCount, setCartCount] = useState();
  const userData = UserData();
  let cart_id = CartID();
  const axios = apiInstance;

  useEffect(() => {
    const url = userData?.user_id
      ? `cart-list/${cart_id}/${userData?.user_id}/`
      : `cart-list/${cart_id}/`;
    axios.get(url).then(res => {
      setCartCount(res.data.length);
    });
  }, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <BrowserRouter>
        <StoreHeader />
        <MainWrapper>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password" element={<CreatePassword />} />

            {/* Store Components */}
            <Route path="/" element={<Products />} />
            <Route path="/detail/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:order_oid" element={<Checkout />} />
            <Route path="/payment-success/:order_oid" element={<PaymentSuccess />} />
            <Route path="/search" element={<Search />} />

            {/* Customer Routes */}
            <Route
              path="/customer/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/order/detail/:order_oid"
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/wishlist"
              element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/notifications"
              element={
                <PrivateRoute>
                  <Notification />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainWrapper>
        <StoreFooter />
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
