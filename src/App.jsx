import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <StoreHeader />
      {/* <MainWrapper> */}
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
      </Routes>
      {/* </MainWrapper> */}
      <StoreFooter />
    </BrowserRouter>
  );
}

export default App;
