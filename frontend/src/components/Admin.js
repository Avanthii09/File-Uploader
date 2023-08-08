// import * as React from 'react';
// import MyNavBarLogout from "./NavBarLogout";
// import '../styles/Admin.css';
// import '@progress/kendo-theme-material';

// function MyAdmin() {
    
//   return (
//     <div>
//       <MyNavBarLogout />
//         <div className='box2'>
//       <div className='adminlist'>
//         <h4> ADMIN </h4>
//         <ul>
//           <li>
//             <a href="/Adduser">
//               <h5> Add Users </h5>
//             </a>
//           </li>
//           <li>
//             <a href="/TimeExtension">
//               <h5> Time Extension </h5>
//             </a>
//           </li>
//         </ul>
//       </div>
//       </div>
//     </div>
//   );
// }

// export default MyAdmin;

import * as React from 'react';
import MyNavBarLogout from "./NavBarLogout";
import '../styles/Admin.css';
import '@progress/kendo-theme-material';
import { useNavigate } from "react-router-dom";

function MyAdmin() {
  const navigate = useNavigate();

  const handleLinkClick = (path) => () => {
    navigate(path);
  };

  return (
    <div>
      <MyNavBarLogout />
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
          </ul>
        </div>
      
      </div>
    </div>
  );
}

export default MyAdmin;
