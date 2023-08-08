import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import MyLogin from "./components/Login";
import MyQuarterSelector from "./components/QuarterSelector";
import MyPrincipalPa from "./components/PrincipalPa";
import MyNavBarLogout from "./components/NavBarLogout";
import MyAdmin from "./components/Admin";
import MyAdduser from "./components/Adduser";
import MyTimeExtension from "./components/TimeExtension";
import MyNavBar from "./components/NavBar";
import { AuthProvider } from "./components/AuthContext";

const baseURL = "http://127.0.0.1:8000";
const api = axios.create({ baseURL });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  // const [user, setUser] = useState({
  //   isLoggedIn: false,
  //   role: "",
  // });

  // Function to store JWT in localStorage
  const storeJWT = (token) => {
    localStorage.setItem("accessToken", token);
  };

  // Function to handle login
  const handleLogin = async (email, password, role) => {
    try {
      let loginEndpoint;

      if (email === "adminPSG@gmail.com") {
        loginEndpoint = "/admin/login";
      } else {
        loginEndpoint = "/user/login";
      }

      const response = await api.post(loginEndpoint, {
        email: email,
        password: password,
      });

      const { access_token, role } = response.data;
      console.log("Role:", role);

      if (access_token) {
        console.log("Role:", role); // Debug: Check the role
        storeJWT(access_token);
        // setUser({ isLoggedIn: true, role: role });
        setIsLoggedIn(true);
        setUserRole(role);

        // Redirect based on successful login
        if (role === "Admin") {
          navigate("/Admin");
        } else if (role === "Section") {
          navigate("/QuarterSelector"); // Redirect to Section landing page
        } else if (role === "Principal PA") {
          navigate("/PrincipalPa"); // Redirect to Principal PA landing page
        }
        return true; // Indicate successful login
      }
    } catch (error) {
      console.error(error);
    }

    return false; // Indicate login failure
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserRole("");
    // setUser({ isLoggedIn: false, role: "" });
    navigate("/");
  };

  return (
   
    <div className="App">
     <AuthProvider>
      {isLoggedIn ? (
        <MyNavBarLogout onLogout={handleLogout} />
      ) : (
        <MyNavBar />
      )}
      <Routes>
      <Route
          path="/"
          element={
            isLoggedIn ? (
              <LoggedInRoutes userRole={userRole} />
            ) : (
              <MyLogin handleLogin={handleLogin} />
            )
          }
        />

        <Route path="/Admin" element={<MyAdmin onLogout={handleLogout}/>} />
        <Route path="/QuarterSelector" element={<MyQuarterSelector  />}  />
        <Route path="/PrincipalPa" element={<MyPrincipalPa onLogout={handleLogout}/>} />
        <Route path="/Adduser" element={<MyAdduser onLogout={handleLogout}/>} />
        <Route path="/TimeExtension" element={<MyTimeExtension onLogout={handleLogout}/>} />
      </Routes>
      </AuthProvider>
    </div>
  );
}

function LoggedInRoutes({ userRole }) {
  if (userRole === "Section") {
    return <Navigate to="/QuarterSelector" />;
  } else if (userRole === "Principal PA") {
    return <Navigate to="/PrincipalPa" />;
  }else if (userRole === "Admin") {
    return <Navigate to="/Admin" />; 
  }else {
    // Handle other user roles or cases
    return <Navigate to="/" />;
  }
}

export default App;
