import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLoader } from "../../../context/LoaderContext";
import api from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

const TeacherEdit: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();

  const { teacher } =
    (location.state as { teacher: any }) || { teacher: {} };

  console.log("Editing Teacher: ", teacher);

  const [formData, setFormData] = useState({
    teacherId: "",
    teacherName: "",
    contactNo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load teacher data into form
  useEffect(() => {
    if (teacher) {
      setFormData({
        teacherId: teacher.teacher_school_id || "",
        teacherName: teacher.teacher_name || "",
        contactNo: teacher.mobile || "",
      });
    }
  }, [teacher]);

  // Handle change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate
  const validateForm = () => {
    if (!formData.teacherId || !formData.teacherName) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (!/^\d{10}$/.test(formData.contactNo)) {
      toast.error("Contact number must be 10 digits");
      return false;
    }

    return true;
  };

  // Submit updated data
  const updateTeacher = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      showLoader();
      setIsSubmitting(true);

      await api.put("/UpdateTeacher", {
        teacher_id: teacher.teacher_id, // required for update
        teacher_school_id: formData.teacherId,
        teacher_name: formData.teacherName,
        mobile: formData.contactNo,
      });

      toast.success("Teacher Updated Successfully!");

      navigate("/school/teacherRecords");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{ color: "#4F97F5" }}>
        Edit Teacher
      </h2>

      <form className="container mt-4" onSubmit={updateTeacher}>
        <div className="row gy-3">

          <div className="col-md-6">
            <label className="form-label">Teacher ID *</label>
            <input
              type="text"
              className="form-control"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Teacher Name *</label>
            <input
              type="text"
              className="form-control"
              name="teacherName"
              value={formData.teacherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Contact No *</label>
            <input
              type="tel"
              className="form-control"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />
          </div>

        </div>

        <div className="mt-4 text-center">
          <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherEdit;
