// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "@progress/kendo-theme-material";
// import "../styles/NavBar.css";

// function MyNavBarLogout( { onLogout } ) {
//   const navigate = useNavigate();


//   const handleLogoutClick = () => {
//     onLogout();
//     navigate("/");
//   };


//   return (
//     <div>
//       <nav className='nav'>
//         <ul>
//           <li>
//             <a href='https://www.psgtech.edu/'>
//               <img className="img-size" src='https://www.psgtech.edu/IIC/psg-2.png' alt='PSG Tech Logo' />
//             </a>
//           </li>

//           <li>
//             <a className="nav-text" href='https://www.psgtech.edu/'> PSG College Of Technology </a>
//           </li>

//         </ul>

//         <div className="login">
//           <button className="login-button" onClick={handleLogoutClick}>LOGOUT</button>
//         </div>

//       </nav>
//     </div>
//   );
// }

// export default MyNavBarLogout;
import React from "react";
// import { useNavigate } from "react-router-dom";
import "@progress/kendo-theme-material";
import "../styles/NavBar.css";
import { useAuth } from "./AuthContext"; // Import your AuthContext

function MyNavBarLogout({ onLogout }) {
  // const navigate = useNavigate();
  const { handleLogout} = useAuth(); // Use the handleLogout function from your AuthContext

  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function

    onLogout(); 

  };

  return (
    <div>
      <nav className='nav'>
        <ul>
          <li>
            <a href='https://www.psgtech.edu/'>
              <img className="img-size" src='https://www.psgtech.edu/IIC/psg-2.png' alt='PSG Tech Logo' />
            </a>
          </li>

          <li>
            <a className="nav-text" href='https://www.psgtech.edu/'> PSG College Of Technology </a>
          </li>

        </ul>

        <div className="login">
          <button className="login-button" onClick={handleLogoutClick}>LOGOUT</button>
        </div>

      </nav>
    </div>
  );
}

export default MyNavBarLogout;
