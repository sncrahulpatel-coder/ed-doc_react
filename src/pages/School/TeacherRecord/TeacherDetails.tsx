import { useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../../context/LoaderContext";
import { useState } from "react";
import { Edit, Download, Mail } from 'lucide-react';
import { confirmAlert } from "../../../utils/confirmAlert";
import { toast } from "react-toastify";

const TeacherDetails = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const location = useLocation();

  const { teacher } =
    (location.state as { teacher: any }) || { teacher: {} };

  console.log(teacher);

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section: any) => {
    setOpenSection(openSection === section ? null : section);
  };

  const confirmAllDownload = async () => {
    try {
      const conf = await confirmAlert("Are you sure?", "Download all Teacher Documents");
      if (conf) {
        toast.success("All Documents Downloaded");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="TeacherRecordPage bg-light min-vh-100 p-3 p-md-4">
        <div className="TeacherRecordPage__container container-fluid bg-white rounded shadow-sm">

          {/* Header */}
          <div className="TeacherRecordPage__header border-bottom p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="text-muted me-2">Status:</span>
                <span className="badge bg-success">Active</span>
              </div>
            </div>

            {/* Profile Section */}
            <div className="TeacherRecordPage__profile row g-4">
              {/* Left */}
              <div className="col-12 col-lg-3 d-flex flex-column align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: "128px", height: "128px" }}>
                  <img src="/loginvideo/profileimg.png" style={{ width: "128px", height: "128px" }} />
                </div>

                <h2 className="h3 fw-bold mb-3">{teacher.teacher_name}</h2>

                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate("Edit", {
                        state: { teacher },
                      })
                    }
                  >
                    <Edit size={20} />
                  </button>

                  <button className="btn btn-primary" onClick={confirmAllDownload}>
                    <Download size={20} />
                  </button>

                  <button className="btn btn-primary d-flex align-items-center gap-2">
                    <Mail size={16} />
                    <span className="d-none d-sm-inline">Invite</span>
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="col-12 col-lg-9">
                <div className="row g-3">

                  <div className="col-12 col-sm-6 col-lg-4">
                    <label className="text-muted small mb-1">Teacher ID</label>
                    <div className="fw-medium">{teacher.teacher_id}</div>
                  </div>

         

                  <div className="col-12 col-sm-6 col-lg-4">
                    <label className="text-muted small mb-1">Mobile</label>
                    <div className="fw-medium">{teacher.mobile}</div>
                  </div>

                  

                </div>
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="TeacherRecordPage__documents p-3 p-md-4">
            <h2 className="h3 fw-bold text-center mb-4">Teacher Documents</h2>

            <div className="accordion" id="teacherAccordion">

              {/* Certificates */}
              <div className="accordion-item mb-3">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${openSection !== "certificate" ? "collapsed" : ""}`}
                    onClick={() => toggleSection("certificate")}
                  >
                    Certificates
                  </button>
                </h2>

                <div className={`accordion-collapse collapse ${openSection === "certificate" ? "show" : ""}`}>
                  <div className="accordion-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="fw-semibold">Experience Certificate</div>
                      <div className="d-flex gap-2">
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

export default TeacherDetails;
