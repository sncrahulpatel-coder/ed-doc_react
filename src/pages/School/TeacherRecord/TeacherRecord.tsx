import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoader } from "../../../context/LoaderContext";
import api from "../../../services/api";

const TeacherRecord = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ------------------------------------------------
  // Fetch Teacher List
  // ------------------------------------------------
  const getData = async () => {
    try {
      showLoader();
      const res = await api.get("/getTeacherList");

      let list = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];

      setTeachers(list);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ------------------------------------------------
  // Filter Logic
  // ------------------------------------------------
  const filteredTeachers = teachers.filter((t) => {
    const nameMatch = t.teacher_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const mobileMatch = t.mobile?.includes(search);
    const teacherIdMatch = t.teacher_school_id?.includes(search);

    return nameMatch || mobileMatch || teacherIdMatch;
  });

  // ------------------------------------------------
  // Pagination Logic
  // ------------------------------------------------
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // ------------------------------------------------
  // Excel Download
  // ------------------------------------------------
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTeachers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "TeacherList.xlsx"
    );
  };

  return (
    <Box p={2} maxWidth="100vw">
      <Box textAlign="center" mb={2}>
        <h2 className="pb-2">Teacher List</h2>
      </Box>

      {/* Controls */}
      <Box
        display="flex"
        justifyContent="end"
        flexWrap="wrap"

        mb={3}
        gap={2}
      >
        <div className="d-flex" style={{ gap: "10px" }}>

          <Button variant="contained" color="success" onClick={handleDownloadExcel}>
            Download Excel
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: "#ec8b16" }}
            onClick={() => navigate("add")}
          >
            Add Teacher
          </Button>

          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className="shadow">
        <Table sx={{ minWidth: 650 }} aria-label="teacher list table">
          <TableHead>
            <TableRow>
              <TableCell style={{textAlign:'center'}}>Sr No</TableCell>
              <TableCell>Teacher ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Access</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTeachers.map((teacher, index) => (
              <TableRow key={teacher.teacher_id} hover>
                <TableCell style={{padding:'8px',textAlign:'center'}}>{startIndex + index + 1}</TableCell>
                <TableCell style={{padding:'8px'}}>{teacher.teacher_school_id}</TableCell>
                <TableCell style={{padding:'8px'}}>{teacher.teacher_name}</TableCell>
                <TableCell style={{padding:'8px'}}>{teacher.mobile}</TableCell>
                <TableCell style={{padding:'8px'}}>
                  <button className="btn btn-primary" onClick={()=>{
                    navigate('Details',{
                      state:{
                        teacher
                      }
                    })
                  }}>View</button></TableCell>
              </TableRow>
            ))}

            {filteredTeachers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Pagination
          count={Math.ceil(filteredTeachers.length / rowsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default TeacherRecord;
