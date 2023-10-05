import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MyNavBar from "./NavBar";
import "../styles/Upload.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ImageConfig } from "../config/ImageConfig";
import uploadImg from "../assets/cloud-computing-g572aff4db_1280.png";

const MyUpload = (props) => {
  const location = useLocation();
  const selectedQuarter = location.state?.selectedQuarter;
  
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
        if (newFile.type === "application/pdf") {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            props.onFileChange(updatedList);
        } else {
            alert("Upload only PDF files.");
        }
    }
};


  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  // const [showAlert, setShowAlert] = useState(false);
  const handleUploadClick = async () => {
    /*try {*/
      setIsUploading(true);
  
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file);
      });
  
      const accessToken = props.accessToken;
      axios.put(
        `http://127.0.0.1:8000/user/upload_pdf/quarter${selectedQuarter}`,
        formData,{ headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          }}).then(function(response){
            alert("Uploaded successfully");
            console.log(response)
        })
}
  return (
    <>
      {/* <MyNavBarLogout handleLogout={handleLogout} /> */}
      <MyNavBar />
      <div
        ref={wrapperRef}
        className={`drop-file-input ${isUploading ? "uploading" : ""}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} accept=".pdf" />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] ||
                  ImageConfig["default"]
                }
                alt=""
              />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div>
        <button
          className={`upload-button ${
            fileList.length === 0 ? "upload-button-disabled" : ""
          }`}
          onClick={handleUploadClick}
          disabled={fileList.length === 0}
        >
          UPLOAD
        </button>
        <div className='back-to-qs'>

           <Link to='/QuarterSelector'>Back to Quarter Selecter </Link>
       </div>


      </div>
    </>
  );
};


MyUpload.propTypes = {
    onFileChange: PropTypes.func,
    accessToken: PropTypes.string,
    selectedQuarter: PropTypes.number,
};

export default MyUpload
