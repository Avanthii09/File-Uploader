import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation} from "react-router-dom";
import axios from "axios";
import MyLogin from "./components/Login";
import MyQuarterSelector from "./components/QuarterSelector";
import MyNavBarLogout from "./components/NavBarLogout";
import MyAdmin from "./components/Admin";
import MyAdduser from "./components/Adduser";
import MyTimeExtension from "./components/TimeExtension";
import MyNavBar from "./components/NavBar";
import MyUpload from "./components/Upload";
// import PrincipalPDFDownload from "./components/Download";
import UnuploadedUsers from "./components/UnuploadedUsers";
import MyExtend from "./components/Extend";
import MyDownloadQuarters from "./components/DownloadQuarterSelector";
import MyPendingList from "./components/PendingList";
import ModifyOrder from "./components/ModifyOrder";


const baseURL = "http://127.0.0.1:8000";
const api = axios.create({ baseURL });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [fileList, setFileList] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const handleFileChange = (newFileList) => {
    setFileList(newFileList);
  };
  
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
        } else if (role === "Principal_PA") {
          navigate("/QuarterSelector"); // Redirect to Principal PA landing page
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
      {isLoggedIn ? (
        <MyNavBarLogout handleLogout={handleLogout}/>
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

        {/* <Route path="/Admin" element={<MyAdmin />} /> */}
        <Route path="/Admin" element={<MyAdmin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/QuarterSelector" element={<MyQuarterSelector setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        {/* <Route path="/QuarterSelector" element={<MyQuarterSelector  />}  />       */}
        <Route path="/Adduser" element={<MyAdduser />} />
        <Route path="/TimeExtension" element={<MyTimeExtension />} />
        <Route path="/Extend" element={<MyExtend/>} />
        <Route path="/DownloadQuarters" element={<MyDownloadQuarters/> } />
        <Route path="/PendingList/:quarter" element={<MyPendingList />} />
        <Route path="/ModifyOrder" element={<ModifyOrder/>} />
        {/* <Route path="/Download" element={<PrincipalPDFDownload />} /> */}
        <Route
        path="/Upload"
        element={
          <MyUpload
            onFileChange={handleFileChange}
                     /> } />
        <Route path="/unuploaded/:quarter" component={UnuploadedUsers} />
      </Routes>

    </div>
  );
}

function LoggedInRoutes({ userRole }) {
  if (userRole === "Section") {
    return <Navigate to="/QuarterSelector" />;
  } else if (userRole === "Principal_PA") {
    return <Navigate to="/QuarterSelector" />;
  }else if (userRole === "Admin") {
    return <Navigate to="/Admin" />; 
  }else {
    // Handle other user roles or cases
    return <Navigate to="/" />;
  }
}

export default App;

