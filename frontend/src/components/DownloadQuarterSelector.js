import React from "react";
import { useNavigate } from "react-router-dom";
import MyNavBarLogout from "./NavBarLogout";
import { Link } from "react-router-dom";
import "../styles/PrincipalPDFDownload.css"; // Import the new CSS file

function MyDownloadQuarters() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleDownload = (quarter) => {
    navigate(`/PendingList/${quarter}`);
  };

  const quarterInfo = [
    { quarter: 1, label: "Quarter 1 (Jan-Mar)" },
    { quarter: 2, label: "Quarter 2 (Apr-Jun)" },
    { quarter: 3, label: "Quarter 3 (Jul-Sep)" },
    { quarter: 4, label: "Quarter 4 (Oct-Dec)" },
  ];

  return (
    <div className="pdf-download">
      <MyNavBarLogout handleLogout={handleLogout} />
      <h2>PDF Download</h2>
      {quarterInfo.map(({ quarter, label }) => (
        <button
          className={`button${quarter}`}
          key={quarter}
          onClick={() => handleDownload(quarter)}
        >
          {label}
        </button>
      ))}
      <Link className="backtoadminlink" to="/Admin">Back to Admin</Link>

    </div>
  );
};

export default MyDownloadQuarters;
