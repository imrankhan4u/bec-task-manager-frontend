import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "../api/axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentsPage = () => {
  const { user, token, loading } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State for edit modal
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState(""); // State for department name in edit modal
  const [departmentToEdit, setDepartmentToEdit] = useState(null); // State for department being edited
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("/api/auth/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data?.departments) {
          setDepartments(response.data.departments);
        } else {
          setMessage("Failed to load departments (unexpected response)");
          setError(true);
          setOpenSnackbar(true);
        }
      })
      .catch(() => {
        setMessage("Failed to load departments");
        setError(true);
        setOpenSnackbar(true);
      });
  }, [user.token]);

  const handleAddDepartment = () => {
    axios
      .post(
        "/api/auth/departments",
        { name: newDepartmentName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDepartments([...departments, response.data.department]);
        setMessage("Department added successfully");
        setError(false);
        setOpenSnackbar(true);
        setOpenAddModal(false);
        setNewDepartmentName("");
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Server error");
        setError(true);
        setOpenSnackbar(true);
      });
  };

  const handleUpdateDepartment = () => {
    if (departmentToEdit) {
      axios
        .patch(
          `/api/auth/departments/${departmentToEdit._id}`,
          { name: editDepartmentName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Update the department list after successful update
          setDepartments(
            departments.map((dept) =>
              dept._id === departmentToEdit._id
                ? { ...dept, name: editDepartmentName } // Update department name in state
                : dept
            )
          );
          setMessage("Department updated successfully");
          setError(false);
          setOpenSnackbar(true);
          setOpenEditModal(false); // Close edit modal
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || "Server error");
          setError(true);
          setOpenSnackbar(true);
        });
    }
  };

  const handleDeleteDepartment = () => {
    if (departmentToDelete) {
      axios
        .delete(`/api/auth/departments/${departmentToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setDepartments(
            departments.filter((dept) => dept._id !== departmentToDelete._id)
          );
          setMessage("Department deleted successfully");
          setError(false);
          setOpenSnackbar(true);
          setOpenDeleteDialog(false);
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || "Server error");
          setError(true);
          setOpenSnackbar(true);
          setOpenDeleteDialog(false);
        });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDeleteDialog = (department) => {
    setDepartmentToDelete(department);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenEditModal = (department) => {
    setDepartmentToEdit(department);
    setEditDepartmentName(department.name); // Pre-fill the department name
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Departments
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddModal(true)}
        sx={{ marginBottom: "20px" }}
      >
        ➕ Add Department
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department._id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenEditModal(department)} // Open edit modal
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(department)}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-department-modal"
      >
        <Box
          sx={{
            padding: "30px",
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "400px",
            margin: "auto",
            marginTop: "100px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Department
          </Typography>
          <TextField
            label="Department Name"
            variant="outlined"
            fullWidth
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddDepartment}
          >
            Add Department
          </Button>
        </Box>
      </Modal>

      {/* Edit department modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-department-modal"
      >
        <Box
          sx={{
            padding: "30px",
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "400px",
            margin: "auto",
            marginTop: "100px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Department
          </Typography>
          <TextField
            label="Department Name"
            variant="outlined"
            fullWidth
            value={editDepartmentName}
            onChange={(e) => setEditDepartmentName(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpdateDepartment}
          >
            Update Department
          </Button>
        </Box>
      </Modal>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this department?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteDepartment} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentsPage;
