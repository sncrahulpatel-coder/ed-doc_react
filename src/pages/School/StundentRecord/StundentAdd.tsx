import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLoader } from "../../../context/LoaderContext";
import api from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Modal, Button } from "react-bootstrap";

const StudentAdd: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------- EDIT MODE DATA -----------------
  const { student } = (location.state as { student: any }) || { student: null };
  const isEditMode = !!student;

  // ----------------- FORM DATA -----------------
  const [formData, setFormData] = useState({
    enrollmentNo: "",
    Standard: "",
    division: "A",
    rollNo: "",
    studentName: "",
    gender: "MALE",
    dob: "",
    fatherName: "",
    motherName: "",
    mobile: "",
    address: "",
  });

  // ----------------- PREFILL WHEN EDIT -----------------
  useEffect(() => {
    if (student) {
      setFormData({
        enrollmentNo: student.enrollment_no,
        Standard: student.standard,
        division: student.division,
        rollNo: student.roll_no,
        studentName: student.student_name,
        gender: student.gender,
        dob: student.dob,
        fatherName: student.father_name,
        motherName: student.mother_name,
        mobile: student.mobile,
        address: student.address,
      });
    }
  }, [student]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Excel Upload States
  const [excelFile, setExcelFile] = useState<any>(null);
  const [excelFileInfo, setExcelFileInfo] = useState({ name: "", size: "" });
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorData, setErrorData] = useState<any[]>([]);

  // ----------------- HANDLE CHANGE -----------------
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ----------------- VALIDATE -----------------
  const validateForm = () => {
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile number must be 10 digits");
      return false;
    }
    if (!formData.enrollmentNo || !formData.studentName || !formData.Standard) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  // ----------------- DOWNLOAD TEMPLATE -----------------
  const downloadTemplate = () => {
    const template = [
      [
        "Enrollment No",
        "Standard",
        "Division",
        "Roll No",
        "Student Name",
        "Gender",
        "Date of Birth (YYYY-MM-DD)",
        "Father Name",
        "Mother Name",
        "Mobile Number",
        "Address",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(file, "Student-Template.xlsx");
  };

  // ----------------- EXCEL UPLOAD -----------------
  const handleExcelUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFile(file);
    setExcelFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
    });

    setShowModal(true);
  };

  // ----------------- SEND EXCEL TO SERVER -----------------
  const uploadExcelFile = async () => {
    if (!excelFile) {
      toast.error("No file selected");
      return;
    }

    try {
      showLoader();
      const form = new FormData();
      form.append("excelFile", excelFile);

      await api.post("/AddStudentExcel", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Excel uploaded successfully!");
      setShowModal(false);

      navigate("/school/studentRecords");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");

      if (err.response && err.response.status === 400) {
        setErrorData(err.response.data.data.errors || []);
        setErrorModal(true);
        setShowModal(false);
      }
    } finally {
      hideLoader();
    }
  };

  // ----------------- ADD + UPDATE SUBMIT HANDLER -----------------
  const sendData = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      showLoader();
      setIsSubmitting(true);

      let response;

      if (isEditMode) {
        // ----------------- UPDATE STUDENT -----------------
        response = await api.put(`/UpdateStudent/${student.student_id}`, formData);
        toast.success("Student Updated Successfully!");
      } else {
        // ----------------- ADD STUDENT -----------------
        response = await api.post("/AddStudent", formData);
        toast.success("Student Registered Successfully!");
      }

      navigate("/school/studentRecords");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container mt-2">
        {/* TOP BUTTONS */}
        {!isEditMode && (
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" onClick={downloadTemplate}>
              📄 Download Template
            </button>

            <label className="btn btn-warning" style={{ backgroundColor: "#ec8b16", color: "#FFF" }}>
              📤 Upload Excel
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleExcelUpload} />
            </label>
          </div>
        )}

        <h2 className="text-center mb-4" style={{ color: "#4F97F5" }}>
          {isEditMode ? "Edit Student" : "Student Registration"}
        </h2>

        {/* FORM */}
        <form className="ed-student-register__form container mt-4" onSubmit={sendData}>
          <div className="row gy-3">

            <div className="col-md-6">
              <label className="form-label">Admission No / Enrollment No *</label>
              <input type="text" className="form-control" name="enrollmentNo"
                value={formData.enrollmentNo} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Standard *</label>
              <input type="text" className="form-control" name="Standard"
                value={formData.Standard} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Division *</label>
              <select className="form-select" name="division"
                value={formData.division} onChange={handleChange} required>
                {["A", "B", "C", "D"].map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Roll No *</label>
              <input type="number" className="form-control" name="rollNo"
                value={formData.rollNo} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Student Name *</label>
              <input type="text" className="form-control" name="studentName"
                value={formData.studentName} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender *</label>
              <select className="form-select" name="gender"
                value={formData.gender} onChange={handleChange} required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth *</label>
              <input type="date" className="form-control" name="dob"
                value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Father Name *</label>
              <input type="text" className="form-control" name="fatherName"
                value={formData.fatherName} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mother Name *</label>
              <input type="text" className="form-control" name="motherName"
                value={formData.motherName} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mobile Number *</label>
              <input type="tel" className="form-control" name="mobile"
                value={formData.mobile} onChange={handleChange} pattern="[0-9]{10}" required />
            </div>

            <div className="col-12">
              <label className="form-label">Address *</label>
              <textarea className="form-control" name="address"
                rows={3} value={formData.address} onChange={handleChange} required />
            </div>

          </div>

          <div className="mt-4 text-center">
            <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
              {isSubmitting ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update" : "Register")}
            </button>
          </div>
        </form>

        {/* EXCEL FILE MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Excel File Upload</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {excelFile ? (
              <>
                <p><strong>File Name:</strong> {excelFileInfo.name}</p>
                <p><strong>File Size:</strong> {excelFileInfo.size}</p>
              </>
            ) : (
              <p>No file selected</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={uploadExcelFile}>Upload File</Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* ERROR MODAL */}
      {errorModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow-lg rounded-3">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Excel Upload Errors</h5>
                <button type="button" className="btn-close btn-close-white"
                  onClick={() => { setErrorModal(false); window.location.reload(); }} />
              </div>

              <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "80px" }}>Row</th>
                      <th>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorData.map((item, idx) => (
                      <tr key={idx}>
                        <td><span className="badge bg-primary">Row {item.row}</span></td>
                        <td>
                          <ul className="mb-0">
                            {item.errors.map((errMsg: string, index: number) => (
                              <li key={index} className="text-danger fw-semibold">{errMsg}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary"
                  onClick={() => { setErrorModal(false); window.location.reload(); }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default StudentAdd;
