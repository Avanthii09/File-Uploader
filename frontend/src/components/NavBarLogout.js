// import React from "react";
// // import { useNavigate } from "react-router-dom";
// import "@progress/kendo-theme-material";
// import "../styles/NavBar.css";
// // import { useAuth } from "./AuthContext";

// function MyNavBarLogout({ handleLogout }) {
//   // const navigate = useNavigate();

//   const handleLogoutClick = () => {
//     handleLogout(); // Call the handleLogout function
//   };
 

//   return (
//     <div>
//       <nav className="nav">
//         <ul>
//           <li>
//             <a href="https://www.psgtech.edu/">
//               <img
//                 className="img-size"
//                 src="https://www.psgtech.edu/IIC/psg-2.png"
//                 alt="PSG Tech Logo"
//               />
//             </a>
//           </li>
//           <li>
//             <a className="nav-text" href="https://www.psgtech.edu/">
//               PSG College Of Technology 
//             </a>
//             <p className="small-text"> COE: QUARTERLY REPORT SUBMISSION PORTAL </p>

//           </li>
//         </ul>
//         <div>
//           <button className="login-button" onClick={handleLogoutClick} 
//           style={{ marginRight: "20px" }}>
//             LOGOUT
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default MyNavBarLogout;


import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "@progress/kendo-theme-material";
import "../styles/NavBar.css";
// import { useAuth } from "./AuthContext";

function MyNavBarLogout({ isLoggedIn, handleLogout }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function
  };

  // Redirect to homepage when not logged in
  const handleHomeClick = () => {
    if (!isLoggedIn) {
      navigate("/");
    }
  };

  return (
    <div>
      <nav className="nav">
        <ul>
          <li>
            <a href="https://www.psgtech.edu/">
              <img
                className="img-size"
                src="https://www.psgtech.edu/IIC/psg-2.png"
                alt="PSG Tech Logo"
              />
            </a>
          </li>
          <li>
            <a className="nav-text" href="https://www.psgtech.edu/" onClick={handleHomeClick}>
              PSG College Of Technology 
            </a>
            <p className="small-text"> COE: QUARTERLY REPORT SUBMISSION PORTAL </p>
          </li>
        </ul>
        <div>
          <button className="login-button" onClick={handleLogoutClick} style={{ marginRight: "20px" }}>
            LOGOUT
          </button>
        </div>
      </nav>
    </div>
  );
}

export default MyNavBarLogout;
