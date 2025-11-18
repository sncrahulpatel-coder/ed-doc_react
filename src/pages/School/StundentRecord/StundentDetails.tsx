
import { useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../../context/LoaderContext";
import { useState } from "react";
import { ChevronDown, Edit, Download, Mail } from 'lucide-react';
import './StundentDetails.css'
import { confirmAlert } from "../../../utils/confirmAlert";
import { toast } from "react-toastify";
const StundentDetails = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const location = useLocation();

  const { student } =
    (location.state as { student: any }) || { standardList: {} };
  console.log(student);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section: any) => {
    setOpenSection(openSection === section ? null : section);
  };

  const confirmAllDownaloadData = async () => {
    try {

      const conf = await confirmAlert("Are you sure.?","Download all the Student Document");
      if(conf){
        toast.success("All Document Downloaded");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  }

  return (
    <>

      <div className="StudentRecordPage bg-light min-vh-100 p-3 p-md-4">
        <div className="StudentRecordPage__container container-fluid bg-white rounded shadow-sm">
          {/* Header Section */}
          <div className="StudentRecordPage__header border-bottom p-3 p-md-4">
            <div className="StudentRecordPage__header-top d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div className="StudentRecordPage__status">
                <span className="text-muted me-2">Status:</span>
                <span className="badge bg-success">Active</span>
              </div>
              {/* <div className="StudentRecordPage__academic-year d-flex align-items-center gap-2">
                <span>📚</span>
                <span className="text-muted">Academic Year: 2026/2027</span>
              </div> */}
            </div>

            {/* Profile Section */}
            <div className="StudentRecordPage__profile">
              <div className="StudentRecordPage__profile-grid row g-4">
                {/* Left Column - Avatar and Actions */}
                <div className="StudentRecordPage__profile-left col-12 col-lg-3">
                  <div className="d-flex flex-column align-items-center">
                    <div className="StudentRecordPage__avatar rounded-circle  d-flex align-items-center justify-content-center mb-3" style={{ width: '128px', height: '128px' }} >
                      <img src='/loginvideo/profileimg.png' style={{ width: '128px', height: '128px' }} />

                    </div>
                    <h2 className="StudentRecordPage__name h3 fw-bold mb-3">{student.student_name}</h2>
                    <div className="StudentRecordPage__actions d-flex gap-2 flex-wrap justify-content-center">
                      <button className="StudentRecordPage__btn-edit btn btn-primary" onClick={()=>{
                        navigate('Edit',{
                          state:{
                            student
                          }
                        });

                      }}>
                        <Edit size={20} />
                      </button>
                      <button className="StudentRecordPage__btn-download btn btn-primary" onClick={()=>{
                        confirmAllDownaloadData();
                      }}>
                        <Download size={20} />
                      </button>
                      <button className="StudentRecordPage__btn-invite btn btn-primary d-flex align-items-center gap-2">
                        <Mail size={16} />
                        <span className="d-none d-sm-inline">Invite Parent</span>
                        <span className="d-sm-none">Invite</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Info Fields */}
                <div className="StudentRecordPage__profile-right col-12 col-lg-9">
                  <div className="StudentRecordPage__info-grid row g-3">
                    {/* Row 1 */}
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Admission | Enrollment no
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.enrollment_no}</div>
                    </div>
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Division
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.division}</div>
                    </div>

                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Standards
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.standard}</div>
                    </div>

                    {/* Row 2 */}
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Student Name
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.student_name}</div>
                    </div>
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Roll no
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.roll_no}</div>
                    </div>
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Father Name
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.father_name}</div>
                    </div>

                    {/* Row 3 */}
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Birthdate
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{new Date(student.dob).toISOString().split("T")[0]}</div>
                    </div>
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Gender
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.gender}</div>
                    </div>
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Mother Name
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.mother_name}</div>
                    </div>

                    {/* Row 4 */}
                    <div className="StudentRecordPage__field col-12 col-sm-6 col-lg-4">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Phone No
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.mobile}</div>
                    </div>
                    <div className="StudentRecordPage__field col-12 col-sm-12 col-lg-8">
                      <label className="StudentRecordPage__label form-label text-muted small mb-1">
                        Address
                      </label>
                      <div className="StudentRecordPage__value fw-medium">{student.address}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Tab Section */}
          <div className="StudentRecordPage__documents p-3 p-md-4">
            <h2 className="StudentRecordPage__section-title text-center mb-4 h3 fw-bold">
              Document Tab
            </h2>

            {/* Accordion Sections */}
            <div className="StudentRecordPage__accordion accordion" id="documentAccordion">
              {/* Admission Documents */}
              <div className="StudentRecordPage__accordion-item accordion-item mb-3">
                <h2 className="accordion-header">
                  <button
                    className={`StudentRecordPage__accordion-header accordion-button ${openSection !== 'admission' ? 'collapsed' : ''
                      }`}
                    type="button"
                    onClick={() => toggleSection('admission')}
                  >
                    <span className="StudentRecordPage__accordion-title">Admission Documents</span>
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${openSection === 'admission' ? 'show' : ''}`}>
                  <div className="StudentRecordPage__accordion-content accordion-body">
                    <div className="StudentRecordPage__document-item d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                      <div className="StudentRecordPage__document-info d-flex align-items-center gap-3">
                        <span className="StudentRecordPage__document-year fw-semibold">2025-26</span>
                        <span className="StudentRecordPage__document-name">Admission forms</span>
                      </div>
                      <div className="StudentRecordPage__document-actions d-flex gap-2 flex-wrap">
                        <button className="btn btn-success btn-sm">View</button>
                        <button className="btn btn-warning btn-sm text-white">Edit</button>
                        <button className="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Records */}
              <div className="StudentRecordPage__accordion-item accordion-item mb-3">
                <h2 className="accordion-header">
                  <button
                    className={`StudentRecordPage__accordion-header accordion-button ${openSection !== 'academic' ? 'collapsed' : ''
                      }`}
                    type="button"
                    onClick={() => toggleSection('academic')}
                  >
                    <span className="StudentRecordPage__accordion-title">Academic Records</span>
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${openSection === 'academic' ? 'show' : ''}`}>
                  <div className="StudentRecordPage__accordion-content accordion-body">
                    <div className="StudentRecordPage__document-item d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                      <div className="StudentRecordPage__document-info d-flex align-items-center gap-3">
                        <span className="StudentRecordPage__document-year fw-semibold">2025-26</span>
                        <span className="StudentRecordPage__document-name">Admission forms</span>
                      </div>
                      <div className="StudentRecordPage__document-actions d-flex gap-2 flex-wrap">
                        <button className="btn btn-success btn-sm">View</button>
                        <button className="btn btn-warning btn-sm text-white">Edit</button>
                        <button className="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaving / Completion */}
              <div className="StudentRecordPage__accordion-item accordion-item mb-3">
                <h2 className="accordion-header">
                  <button
                    className={`StudentRecordPage__accordion-header accordion-button ${openSection !== 'leaving' ? 'collapsed' : ''
                      }`}
                    type="button"
                    onClick={() => toggleSection('leaving')}
                  >
                    <span className="StudentRecordPage__accordion-title">Leaving / Completion</span>
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${openSection === 'leaving' ? 'show' : ''}`}>
                  <div className="StudentRecordPage__accordion-content accordion-body">
                    <div className="StudentRecordPage__document-item d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                      <div className="StudentRecordPage__document-info d-flex align-items-center gap-3">
                        <span className="StudentRecordPage__document-year fw-semibold">2025-26</span>
                        <span className="StudentRecordPage__document-name">Admission forms</span>
                      </div>
                      <div className="StudentRecordPage__document-actions d-flex gap-2 flex-wrap">
                        <button className="btn btn-success btn-sm">View</button>
                        <button className="btn btn-warning btn-sm text-white">Edit</button>
                        <button className="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StundentDetails;
