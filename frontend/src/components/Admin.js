// import React from 'react';
// import MyNavBarLogout from "./NavBarLogout";
// import '../styles/Admin.css';
// import '@progress/kendo-theme-material';
// import { useNavigate } from "react-router-dom";

// // function MyAdmin() {
//   function MyAdmin({ setIsLoggedIn, setUserRole }) {
//   const navigate = useNavigate();
 

//   const handleLogout = async () => {
//     // Clear local storage and update state
//     localStorage.removeItem("accessToken");
//     setIsLoggedIn(false);
//     setUserRole("");
  
//     // Wait for the state update to complete
//     await Promise.resolve();
  
//     // Navigate to the root ("/") route
//     navigate("/");
//   };
  
  
//   const handleLinkClick = (path) => () => {
//     navigate(path);
//   };

//   return (
//     <div>
//       <MyNavBarLogout handleLogout={handleLogout}/>
//       <div className='admin'>
//         <div className='admin-list'>
//           <h4> ADMIN </h4>
//           <ul>
//             <li>
//               <a href="/Adduser" onClick={handleLinkClick("/Adduser")}>
//                 <h5> Add Users </h5>
//               </a>
//             </li>
//             <li>
//               <a href="/TimeExtension" onClick={handleLinkClick("/TimeExtension")}>
//                 <h5> Time Extension </h5>
//               </a>
//             </li>

//             <li>
//               <a href="/DownloadQuarters" onClick={handleLinkClick("/DownloadQuarters")}>
//                 <h5> Download </h5>
//               </a>
//             </li>
//             <li>
//               <a href="/ModifyOrder" onClick={handleLinkClick("/ModifyOrder")}>
//                 <h5> Modify Order </h5>
//               </a>
//             </li>
//           </ul>
//         </div>
      
//       </div>
//     </div>
//   );
// }

// export default MyAdmin;



import React, { useEffect } from 'react';
import MyNavBarLogout from "./NavBarLogout";
import '../styles/Admin.css';
import '@progress/kendo-theme-material';
import { useNavigate } from "react-router-dom";

function MyAdmin({ setIsLoggedIn, setUserRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is not logged in
    if (!localStorage.getItem("accessToken")) {
      // Redirect to the root ("/") route
      navigate("/");
    }
  }, [navigate]);


  
  const handleLogout = async () => {
    // Clear local storage and update state
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserRole("");

    // Wait for the state update to complete
    await Promise.resolve();

    // Navigate to the root ("/") route
    navigate("/");
  };

  const handleLinkClick = (path) => () => {
    navigate(path);
  };

  return (
    <div>
      <MyNavBarLogout handleLogout={handleLogout} />
      <div className='admin'>
        <div className='admin-list'>
          <h4> ADMIN </h4>
          <ul>
            <li>
              <a href="/Adduser" onClick={handleLinkClick("/Adduser")}>
                <h5> Add Users </h5>
              </a>
            </li>
            <li>
              <a href="/TimeExtension" onClick={handleLinkClick("/TimeExtension")}>
                <h5> Time Extension </h5>
              </a>
            </li>

            <li>
              <a href="/DownloadQuarters" onClick={handleLinkClick("/DownloadQuarters")}>
                <h5> Download </h5>
              </a>
            </li>
            <li>
              <a href="/ModifyOrder" onClick={handleLinkClick("/ModifyOrder")}>
                <h5> Modify Order </h5>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyAdmin;
