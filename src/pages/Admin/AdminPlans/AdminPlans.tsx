import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { useLoader } from "../../../context/LoaderContext";
import { confirmAlert } from "../../../utils/confirmAlert";

const AdminPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [formData, setFormData] = useState({ planName: "", storageGB: "" });
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const { showLoader, hideLoader } = useLoader();

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      showLoader();
      const res = await api.get("/plans");
      setPlans(res.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch plans");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validate = () => {
    if (!formData.planName.trim()) {
      toast.error("Plan name is required");
      return false;
    }
    if (!formData.storageGB.trim() || isNaN(Number(formData.storageGB))) {
      toast.error("Enter a valid GB storage value");
      return false;
    }
    return true;
  };

  // Add or Update plan
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      showLoader();
      if (editingPlanId) {
        await api.post(`/plans/${editingPlanId}`, {
          plan_name: formData.planName,
          gb: Number(formData.storageGB),
        });
        toast.success("Plan updated successfully");
      } else {
        await api.post("/plans", {
          plan_name: formData.planName,
          gb: Number(formData.storageGB),
        });
        toast.success("Plan added successfully");
      }

      setFormData({ planName: "", storageGB: "" });
      setEditingPlanId(null);
      fetchPlans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  // Delete plan
  const handleDelete = async (id: string) => {
    if (!await confirmAlert('Are you sure .?','')) return;

    try {
      showLoader();
      await api.delete(`/plans/${id}`);
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete plan");
    } finally {
      hideLoader();
    }
  };

  // Edit mode
  const handleEdit = (plan: any) => {
    setFormData({
      planName: plan.plan_name,
      storageGB: plan.gb.toString(),
    });
    setEditingPlanId(plan.plan_id);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-primary text-center">📦 Manage School Plans</h2>

      {/* Card Wrapper for Form */}
      <div
        className="card shadow-sm border-0 mb-5"
        style={{ borderRadius: "15px", backgroundColor: "#f9faff" }}
      >
        <div className="card-body">
          <h5 className="mb-3 fw-semibold text-secondary">
            {editingPlanId ? "✏️ Edit Plan" : "➕ Add New Plan"}
          </h5>
          <form
            onSubmit={handleSubmit}
            className="row align-items-end g-3"
          >
            <div className="col-md-5">
              <label className="form-label fw-semibold">Plan Name</label>
              <input
                type="text"
                name="planName"
                placeholder="Enter plan name"
                className="form-control form-control-lg shadow-sm"
                value={formData.planName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">Storage (GB)</label>
              <input
                type="number"
                name="storageGB"
                placeholder="e.g., 50"
                className="form-control form-control-lg shadow-sm"
                value={formData.storageGB}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2 d-grid">
              <button
                type="submit"
                className={`btn btn-lg ${editingPlanId ? "btn-warning" : "btn-primary"} shadow-sm fw-semibold`}
              >
                {editingPlanId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Plans Table */}
      <div
        className="card shadow-sm border-0"
        style={{ borderRadius: "15px", backgroundColor: "#fff" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold text-secondary mb-3">📋 Available Plans</h5>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Plan Name</th>
                  <th>Storage</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-3">
                      No plans found
                    </td>
                  </tr>
                ) : (
                  plans.map((plan, index) => (
                    <tr key={plan.id}>
                      <td className="fw-bold text-secondary">{index + 1}</td>
                      <td className="fw-semibold">{plan.plan_name}</td>
                      <td>{plan.gb} GB</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            style={{
                              height: "10px",
                              width: "10px",
                              borderRadius: "50%",
                              display: "inline-block",
                              backgroundColor: plan.status ? "#28a745" : "#dc3545",
                              marginRight: "8px",
                              boxShadow: plan.status
                                ? "0 0 6px 2px rgba(40, 167, 69, 0.4)"
                                : "0 0 6px 2px rgba(220, 53, 69, 0.4)",
                            }}
                          ></span>
                          <span
                            className="fw-semibold"
                            style={{ color: plan.status ? "#28a745" : "#dc3545" }}
                          >
                            {plan.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-warning me-2 px-3"
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm px-3 ${plan.status ? "btn-outline-danger" : "btn-outline-success"
                            }`}
                          onClick={() => handleDelete(plan.plan_id)}
                        >
                          {plan.status ? "Deactivate" : "Activate"}
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
