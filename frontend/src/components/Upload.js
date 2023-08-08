import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MyNavBarLogout from './NavBarLogout';
import '../styles/Upload.css';
import axios from 'axios';
import { ImageConfig } from '../config/ImageConfig';
import uploadImg from '../assets/cloud-computing-g572aff4db_1280.png';



const MyUpload = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            props.onFileChange(updatedList);
        }
    }

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        props.onFileChange(updatedList);
    }

    // const [showAlert, setShowAlert] = useState(false);
    const handleUploadClick = async () => {
        try {
            // Create a FormData object to send the files to the backend
            const formData = new FormData();
            fileList.forEach((file) => {
              formData.append('files', file);
            });

            const accessToken = props.accessToken;

      
            // Make the API call to upload the files
            await axios.put('/user/upload_pdf', formData, {
              headers: {
                'Content-Type': 'multipart/form-data', // Important: Set the content type for FormData
                Authorization: `Bearer ${accessToken}`,
              },
            });
      
            // Display success message
            alert('Uploaded successfully');
          } catch (error) {
            // Handle error
            console.error('Error uploading files:', error);
            alert('Error uploading files');
          }

      
    };



    return (
        <>
            <MyNavBarLogout />
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input type="file" value="" onChange={onFileDrop} />
            </div>
            {
                fileList.length > 0 ? (
                    <div className="drop-file-preview">
                        {
                            fileList.map((item, index) => (
                                <div key={index} className="drop-file-preview__item">
                                    <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{item.name}</p>
                                        <p>{item.size}B</p>
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
                                </div>

                            ))
                        }
                    </div>
                ) : null
            }
            <div>
                {/* <button className='upload-button' */}
                <button   className={`upload-button ${fileList.length === 0 ? 'upload-button-disabled' : ''}`}
 
                onClick={handleUploadClick} disabled={fileList.length === 0} >
                    UPLOAD
                </button>

            </div>

        </>
    );
}

MyUpload.propTypes = {
    onFileChange: PropTypes.func,
    accessToken: PropTypes.string, // Add the accessToken prop to the prop types
  };

export default MyUpload;