import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { useLoader } from "../../../context/LoaderContext";
const MAX_IMAGE_SIZE = 300 * 1024; // 300 KB

const AdminSchoolRegister = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    address: "",
    phone: "",
    email: "",
    yearOfEstablishment: "",
    totalStandard: "",
    totalStudents: "",
    totalTeachers: "",
    totalSubjects: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  // Handle form input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 300 KB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setImageFile(file);
  };
  // Validation
  const validate = () => {
    let newErrors: any = {};

    if (!formData.schoolName.trim()) newErrors.schoolName = "School name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.yearOfEstablishment.trim())
      newErrors.yearOfEstablishment = "Year of Establishment is required";
    else if (
      !/^(19|20)\d{2}$/.test(formData.yearOfEstablishment) ||
      parseInt(formData.yearOfEstablishment) > new Date().getFullYear()
    )
      newErrors.yearOfEstablishment = "Enter a valid year";

    if (!formData.totalStandard.trim())
      newErrors.totalStandard = "Total Standard is required";

    if (!formData.totalStudents.trim())
      newErrors.totalStudents = "Total Students is required";
    else if (isNaN(Number(formData.totalStudents)) || Number(formData.totalStudents) <= 0)
      newErrors.totalStudents = "Enter a valid number";

    if (!formData.totalTeachers.trim())
      newErrors.totalTeachers = "Total Teachers is required";
    else if (isNaN(Number(formData.totalTeachers)) || Number(formData.totalTeachers) <= 0)
      newErrors.totalTeachers = "Enter a valid number";

    if (!formData.totalSubjects.trim())
      newErrors.totalSubjects = "Total Subjects is required";
    else if (isNaN(Number(formData.totalSubjects)) || Number(formData.totalSubjects) <= 0)
      newErrors.totalSubjects = "Enter a valid number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const { showLoader, hideLoader } = useLoader();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    if(!imageFile){
      return toast.error('Please Upload Image')
    }
    showLoader()
    
    try {
      // Prepare payload with image details if image selected
      const payload = {
        ...formData,
        image: imageFile
          ? {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
          }
          : null,
      };

      // Send to /school/register endpoint
      const response = await api.post("/school/register", payload);

      // Expecting AWS upload URL for image in response.data.uploadUrl
      const { uploadUrl } = response.data.data;
      console.log(uploadUrl)
      toast.success("School registered successfully!");

      if (uploadUrl && imageFile) {
        // Upload image to AWS using the URL
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": imageFile.type,
          },
          body: imageFile,
        });

        if (uploadResponse.ok) {
          toast.success("Image uploaded successfully!");
          
        } else {
          toast.error("Failed to upload image to AWS");
        }
      }

      // Clear form and image
      setFormData({
        schoolName: "",
        address: "",
        phone: "",
        email: "",
        yearOfEstablishment: "",
        totalStandard: "",
        totalStudents: "",
        totalTeachers: "",
        totalSubjects: "",
      });
      setImageFile(null);
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("API Error:", error);
    }finally{
      hideLoader();
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 ">Admin School Register</h2>
      <form onSubmit={handleSubmit} className="row p-3 border rounded shadow-sm bg-light">
        {/* School Name */}
        <div className="mb-3 col-3">
          <label className="form-label">School Name</label>
          <input
            type="text"
            name="schoolName"
            className={`form-control ${errors.schoolName ? "is-invalid" : ""}`}
            value={formData.schoolName}
            onChange={handleChange}
          />
          {errors.schoolName && <div className="invalid-feedback">{errors.schoolName}</div>}
        </div>

        {/* Address */}
        <div className="mb-3 col-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        {/* Phone Number */}
        <div className="mb-3 col-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        {/* Email */}
        <div className="mb-3 col-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Year of Establishment */}
        <div className="mb-3 col-3">
          <label className="form-label">Year of Establishment</label>
          <input
            type="text"
            name="yearOfEstablishment"
            className={`form-control ${errors.yearOfEstablishment ? "is-invalid" : ""}`}
            value={formData.yearOfEstablishment}
            onChange={handleChange}
          />
          {errors.yearOfEstablishment && (
            <div className="invalid-feedback">{errors.yearOfEstablishment}</div>
          )}
        </div>

        {/* Total Standard */}
        <div className="mb-3 col-3">
          <label className="form-label">Total Standard</label>
          <input
            type="text"
            name="totalStandard"
            className={`form-control ${errors.totalStandard ? "is-invalid" : ""}`}
            value={formData.totalStandard}
            onChange={handleChange}
          />
          {errors.totalStandard && (
            <div className="invalid-feedback">{errors.totalStandard}</div>
          )}
        </div>

        {/* Total Students */}
        <div className="mb-3 col-3">
          <label className="form-label">Total Students</label>
          <input
            type="number"
            name="totalStudents"
            className={`form-control ${errors.totalStudents ? "is-invalid" : ""}`}
            value={formData.totalStudents}
            onChange={handleChange}
          />
          {errors.totalStudents && (
            <div className="invalid-feedback">{errors.totalStudents}</div>
          )}
        </div>

        {/* Total Teachers */}
        <div className="mb-3 col-3">
          <label className="form-label">Total Teachers</label>
          <input
            type="number"
            name="totalTeachers"
            className={`form-control ${errors.totalTeachers ? "is-invalid" : ""}`}
            value={formData.totalTeachers}
            onChange={handleChange}
          />
          {errors.totalTeachers && (
            <div className="invalid-feedback">{errors.totalTeachers}</div>
          )}
        </div>

        {/* Total Subjects */}
        <div className="mb-3 col-3">
          <label className="form-label">Total Subjects</label>
          <input
            type="number"
            name="totalSubjects"
            className={`form-control ${errors.totalSubjects ? "is-invalid" : ""}`}
            value={formData.totalSubjects}
            onChange={handleChange}
          />
          {errors.totalSubjects && (
            <div className="invalid-feedback">{errors.totalSubjects}</div>
          )}
        </div>
        <div className="mb-3 col-6">
          <label className="form-label">School Image (max 300 KB)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>
        <div className="row">

          <button type="submit" className="col-3 btn btn-primary ">
            Register School
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSchoolRegister;
