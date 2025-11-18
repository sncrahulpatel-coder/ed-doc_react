import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

const StundentRecord = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [standard, setStandard] = useState("All"); // DEFAULT = ALL
  const [uniqueStandards, setUniqueStandards] = useState<any>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // -----------------------
  // Fetch student list
  // -----------------------
  const getData = async () => {
    try {
      showLoader();
      const res = await api.get("/getStudentList");

      let list = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];

      setStudents(list);

      // Extract unique standards dynamically
      const standards = Array.from(
        new Set(list.map((item: any) => item.standard))
      );

      // Add "All" at the top
      setUniqueStandards(["All", ...standards]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, standard]);

  // -----------------------
  // Filter logic
  // -----------------------
  const filteredStudents = students.filter((student) => {
    const matchesStandard =
      standard === "All" || student.standard === standard;

    const nameMatch = student.student_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const enrollmentMatch = student.enrollment_no?.includes(search);

    return matchesStandard && (nameMatch || enrollmentMatch);
  });

  // -----------------------
  // Pagination logic
  // -----------------------
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // -----------------------
  // Excel Download
  // -----------------------
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "StudentList.xlsx");
  };

  return (
    <Box p={2} maxWidth="100vw">
      <Box textAlign="center" mb={2}>
        <h2 className="pb-2">Student List</h2>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        alignItems="center"
        mb={3}
        gap={2}
      >
        {/* Left Controls */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="standard-label">Standard</InputLabel>
            <Select
              labelId="standard-label"
              value={standard}
              label="Standard"
              onChange={(e) => setStandard(e.target.value)}
            >
              {uniqueStandards.map((std: any) => (
                <MenuItem key={std} value={std}>
                  {std}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Right Controls */}
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Button variant="contained" color="success" onClick={handleDownloadExcel}>
            Download Excel
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: "#ec8b16" }}
            onClick={() => navigate("add")}
          >
            Add Student
          </Button>

          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      <TableContainer component={Paper} className="shadow">
        <Table sx={{ minWidth: 650 }} aria-label="student list table">
          <TableHead>
            <TableRow>
              <TableCell style={{textAlign:'center'}}>Sr No</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Access</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedStudents.map((student, index) => (
              <TableRow key={student.student_id} hover>
                <TableCell style={{padding:'8px',textAlign:'center'}}>{startIndex + index + 1}</TableCell>
                <TableCell style={{padding:'8px'}}>{student.enrollment_no}</TableCell>
                <TableCell style={{padding:'8px'}}>{student.roll_no}</TableCell>
                <TableCell style={{padding:'8px'}}>{student.student_name}</TableCell>
                <TableCell style={{padding:'8px'}}>{student.standard}</TableCell>
                <TableCell style={{padding:'8px'}}>{student.division}</TableCell>
                <TableCell style={{padding:'8px'}}>{student.mobile}</TableCell>
                <TableCell style={{padding:'8px'}}>
                  <button className="btn btn-primary" onClick={()=>{
                    navigate('Student',{
                      state:{
                        student
                      }
                    })
                  }}>View</button>
                </TableCell>
              </TableRow>
            ))}

            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Pagination
          count={Math.ceil(filteredStudents.length / rowsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default StundentRecord;
