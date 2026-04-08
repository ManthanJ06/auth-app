import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/Home";
import Navh from "./components/navh";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* <Navbar /> */}
      {isAuthPage ? <Navbar /> : <Navh />} {/* ✅ Conditional Navbar */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
