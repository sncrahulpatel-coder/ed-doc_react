import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  Column,
} from "react-table";
import { toast } from "react-toastify";
import { Modal, Button, ProgressBar, Form } from "react-bootstrap";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import { useLoader } from "../../../context/LoaderContext";
import api from "../../../services/api";
import "./AdminSchoolList.css";

interface School {
  school_id: number;
  logo: string;
  school_name: string;
  number: string;
  address: string;
  email: string;
  year_of_establishment: string;
  total_standard: string;
  total_students: string;
  total_teachers: string;
  total_subjects: string;
  created_at: string;
  updated_at: string;
  status: boolean;
  total_gb: string | null;
  used_gb: string | null;
  plan_id: number | null;
}

const AdminSchoolList: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
const formatGb = (value: any) => {
  const num = Number(value); // convert string → number safely
  if (isNaN(num)) return "0.000"; // if invalid string
  return Math.max(0.001, Number(num.toFixed(3)));
};

  // Fetch plans (no loader here; getData will show loader)
  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");
      setPlans(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch plans");
    }
  };

  // Fetch schools + plans
  const getData = async () => {
    try {
      showLoader();
      await fetchPlans();
      const res = await api.get("/SchoolList");
      setSchools(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle School Status
  const handleStatusToggle = async (schoolId: number, currentStatus: boolean) => {
    try {
      showLoader();
      const newStatus = !currentStatus;
      await api.put(`/updateSchoolStatus/${schoolId}`, { status: newStatus });
      setSchools((prev) =>
        prev.map((s) => (s.school_id === schoolId ? { ...s, status: newStatus } : s))
      );
      toast.success(`School ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Status update failed");
    } finally {
      hideLoader();
    }
  };

  // Helper to calculate % used
  const calculateUsedPercent = (used?: string | null, total?: string | null) => {
    const usedNum = parseFloat(used || "0");
    const totalNum = parseFloat(total || "0");
    if (!totalNum || totalNum === 0) return 0;
    return Math.min(100, Math.round((usedNum / totalNum) * 100));
  };

  // Columns (depends on plans)
  const columns: Column<School>[] = useMemo(
    () => [
      { Header: "ID", accessor: "school_id" as const },
      {
        Header: "Logo",
        accessor: "logo" as const,
        Cell: ({ value }: any) => (
          <img
            src={value ? `${value}` : "/placeholder.png"}
            alt="logo"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            }}
          />
        ),
      },
      { Header: "Name", accessor: "school_name" as const },
      { Header: "Phone", accessor: "number" as const },
      { Header: "Email", accessor: "email" as const },
      {
        Header: "Plan",
        accessor: "plan_id" as const,
        Cell: ({ row }: any) => {
          // guard against null/undefined
          const plan = plans.find(
            (p) => String(p?.plan_id) === String(row.original?.plan_id ?? "")
          );
          return (
            <span className="badge bg-info text-dark px-3 py-2 rounded-pill shadow-sm">
              {plan ? `${plan.plan_name} (${plan.gb}GB)` : "No Plan"}
            </span>
          );
        },
      },
      {
        Header: "Storage Used",
        accessor: "used_gb" as const,
        Cell: ({ row }: any) => {
          const percent = calculateUsedPercent(row.original.used_gb, row.original.total_gb);
          return row.original.total_gb ? (
            <span
              className={`badge bg-${percent > 80 ? "danger" : percent > 50 ? "warning" : "success"}`}
            >
              {percent}% Used
            </span>
          ) : (
            <span className="text-muted">N/A</span>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status" as const,
        Cell: ({ row }: any) => (
          <label className="switch">
            <input
              type="checkbox"
              checked={!!row.original.status}
              onChange={() => handleStatusToggle(row.original.school_id, row.original.status)}
            />
            <span className="slider round"></span>
          </label>
        ),
      },
      {
        Header: "Created At",
        accessor: "created_at" as const,
        Cell: ({ value }: any) => (value ? new Date(value).toLocaleDateString() : ""),
      },
      {
        Header: "Info",
        Cell: ({ row }: any) => (
          <FaInfoCircle
            style={{ cursor: "pointer", color: "#007bff", fontSize: "1.3rem" }}
            onClick={() => {
              setSelectedSchool(row.original);
              setShowModal(true);
            }}
          />
        ),
      },
    ],
    [plans]
  );

  // Global filter implementation: search by name/email/phone (case-insensitive)
  const globalFilterFunction = (rows: any[], _columnIds: any[], filterValue: string) => {
    const fv = String(filterValue || "").trim().toLowerCase();
    if (!fv) return rows;
    return rows.filter((row) => {
      const name = String(row.original?.school_name || "").toLowerCase();
      const email = String(row.original?.email || "").toLowerCase();
      const number = String(row.original?.number || "").toLowerCase();
      return name.includes(fv) || email.includes(fv) || number.includes(fv);
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: schools,
      initialState: { pageIndex: 0, pageSize: 5 },
      globalFilter: globalFilterFunction,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // when search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchText(v);
    setGlobalFilter(v);
  };

  return (
    <div className="p-3 AdminSchoolList">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="w-100 mb-3">

        <h2 className="fw-bold text-primary mb-0">🏫 Admin School List</h2>
        </div>

        {/* Search bar */}
        <div
          className="d-flex align-items-center bg-light rounded-pill px-3 shadow-sm"
          style={{ maxWidth: "360px", flex: "1 1 360px" }}
        >
          <FaSearch className="text-muted me-2" />
          <Form.Control
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchText}
            onChange={handleSearchChange}
            className="border-0 bg-transparent shadow-none"
          />
        </div>

        <Button variant="primary" onClick={() => navigate("Register")} className="rounded-pill px-4">
          + Register School
        </Button>
      </div>

      {schools.length > 0 ? (
        <div className="table-responsive shadow-sm rounded-3 bg-white p-3">
          <table {...getTableProps()} className="table table-hover align-middle">
            <thead className="table-primary">
              {headerGroups.map((headerGroup: any) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                  {headerGroup.headers.map((column: any) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                      {column.render("Header")}
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row: any) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.getRowProps().key}>
                    {row.cells.map((cell: any) => (
                      <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button variant="outline-secondary" disabled={!canPreviousPage} onClick={() => previousPage()}>
              Previous
            </Button>
            <span className="text-muted">
              Page <strong>{pageIndex + 1}</strong>
            </span>
            <Button variant="outline-secondary" disabled={!canNextPage} onClick={() => nextPage()}>
              Next
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted mt-5">No schools found.</p>
      )}

      {/* School Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedSchool?.school_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSchool && (
            <>
              <div className="row">
                <div className="col-md-4 text-center">
                  <img
                    src={selectedSchool.logo ? `${selectedSchool.logo}` : "/placeholder.png"}
                    alt="School Logo"
                    className="img-fluid rounded-circle mb-3 shadow"
                    style={{ width: 150, height: 150, objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th>Address:</th>
                        <td>{selectedSchool.address}</td>
                      </tr>
                      <tr>
                        <th>Phone:</th>
                        <td>{selectedSchool.number}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{selectedSchool.email}</td>
                      </tr>
                      <tr>
                        <th>Year of Establishment:</th>
                        <td>{selectedSchool.year_of_establishment}</td>
                      </tr>
                      <tr>
                        <th>Total Standards:</th>
                        <td>{selectedSchool.total_standard}</td>
                      </tr>
                      <tr>
                        <th>Total Students:</th>
                        <td>{selectedSchool.total_students}</td>
                      </tr>
                      <tr>
                        <th>Total Teachers:</th>
                        <td>{selectedSchool.total_teachers}</td>
                      </tr>
                      <tr>
                        <th>Total Subjects:</th>
                        <td>{selectedSchool.total_subjects}</td>
                      </tr>
                      <tr>
                        <th>Created At:</th>
                        <td>{new Date(selectedSchool.created_at).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <th>Updated At:</th>
                        <td>{new Date(selectedSchool.updated_at).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Storage & Plan Section */}
              <hr />
              <h5 className="mt-4 fw-bold text-secondary">💾 Storage & Plan Details <span style={{color:" rgb(213 213 213)"}}>(${formatGb(selectedSchool.used_gb) || 0}GB / ${formatGb(selectedSchool.total_gb) || 0}GB)</span></h5>

              <div className="mt-3">
                <ProgressBar
                  now={calculateUsedPercent(selectedSchool.used_gb, selectedSchool.total_gb)}
                  label={`${formatGb(selectedSchool.used_gb) || 0}GB / ${formatGb(selectedSchool.total_gb) || 0}GB`}
                  variant={calculateUsedPercent(selectedSchool.used_gb, selectedSchool.total_gb) > 80 ? "danger" : "info"}
                  style={{ height: "25px", borderRadius: "10px" }}
                />
              </div>

              {/* Plan Update */}
              <div className="mt-4 p-3 border rounded bg-light shadow-sm">
                <h6 className="fw-semibold text-primary mb-3">Change School Plan</h6>

                <div className="row align-items-center">
                  <div className="col-md-8">
                    <select
                      className="form-select form-select-lg mb-2"
                      value={selectedSchool.plan_id ?? ""}
                      onChange={(e) =>
                        setSelectedSchool({
                          ...selectedSchool,
                          plan_id: e.target.value === "" ? null : Number(e.target.value),
                        } as School)
                      }
                    >
                      <option value="">-- Select Plan --</option>
                      {plans.map((plan) => (
                        <option key={plan.plan_id} value={plan.plan_id}>
                          {plan.plan_name} ({plan.gb}GB)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 text-end">
                    <Button
                      variant="success"
                      className="px-4 rounded-pill"
                      onClick={async () => {
                        if (!selectedSchool) return;
                        if (!selectedSchool.plan_id) {
                          toast.warning("Please select a plan first.");
                          return;
                        }
                        try {
                          showLoader();
                          await api.put(`/updateSchoolPlan/${selectedSchool.school_id}`, {
                            plan_id: selectedSchool.plan_id,
                          });
                          toast.success("Plan updated successfully!");
                          await getData();
                          setShowModal(false);
                        } catch (err: any) {
                          toast.error(err?.response?.data?.message || "Failed to update plan");
                        } finally {
                          hideLoader();
                        }
                      }}
                    >
                      💾 Save
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSchoolList;
