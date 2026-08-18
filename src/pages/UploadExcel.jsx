// src/pages/UploadExcel.jsx
import { useState, useRef } from "react";
import { Upload, File, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import api from "../api/axios";
import "../styles/upload.css";

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))
    ) {
      setFile(droppedFile);
      setResult(null);
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await api.post("/uploads/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="upload-something">
    <div className="upload-container">
      <h2>Upload Excel</h2>
      <p>Import Students from Excel File</p>

      <div
        className={`drop-zone ${file ? "has-file" : ""}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <Upload size={48} className="upload-icon" />
            <h3>Drag & drop your Excel file here</h3>
            <p>or</p>
            <button
              className="choose-file-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </>
        ) : (
          <div className="file-info">
            <File size={32} />
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button className="remove-file" onClick={removeFile}>
              <XCircle size={20} />
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="upload-actions">
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload & Process"}
          </button>
        </div>
      )}

      {result && (
        <div className="upload-result">
          <h3>Import Results</h3>
          <div className="result-stats">
            <div className="stat-item">
              <span className="label">Total Records</span>
              <span className="value">{result.totalRecords}</span>
            </div>
            <div className="stat-item success">
              <CheckCircle size={20} />
              <span className="label">Imported</span>
              <span className="value">{result.imported}</span>
            </div>
            <div className="stat-item error">
              <AlertCircle size={20} />
              <span className="label">Failed</span>
              <span className="value">{result.failed}</span>
            </div>
          </div>
          <p className="result-message">{result.message}</p>
        </div>
      )}

      <div className="upload-info">
        <h4>Requirements:</h4>
        <ul>
          <li>Excel file must contain the required columns</li>
          <li>AI prediction will be done automatically for each student</li>
          <li>Supported formats: .xlsx, .xls</li>
        </ul>
      </div>
    </div>
    </div>
  );
}

export default UploadExcel;
