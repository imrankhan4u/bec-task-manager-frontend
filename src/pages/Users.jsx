import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

// Confirmation Modal Component
const ConfirmationModal = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "Confirm Action"}</DialogTitle>
      <DialogContent>
        <Typography>
          {content || "Are you sure you want to proceed?"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [confirmationModal, setConfirmationModal] = useState({ open: false });
  const [errorMessages, setErrorMessages] = useState([]); // To store validation errors
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Restrict access to non-Admins
  if (user.role !== "Admin") {
    return <Navigate to="/unauthorized" />;
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/all-users", {
        headers: {
          Authorization: `Bearer ${user.token}`, // <-- send the token
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setFormData({ name: "", email: "", role: "", password: "" });
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setErrorMessages([]); // Clear error messages on close
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingUser(null);
    setErrorMessages([]); // Clear error messages on close
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setErrorMessages([]);

    // Basic client-side validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      (openCreateModal && !formData.password)
    ) {
      setErrorMessages((prev) => [...prev, "All fields are required."]);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${user.token}`, // Include JWT token
      };

      if (editingUser) {
        // Edit user (password is not included)
        const res = await axios.patch(
          `/api/auth/users/${editingUser._id}`,
          formData,
          { headers }
        );
        if (res.status === 200) {
          fetchUsers();
          handleCloseCreateModal();
          handleCloseEditModal();

          // Show success message for user update
          setSnackbarMessage("User updated successfully");
          setSnackbarOpen(true);
        }
      } else {
        // Create new user (password is included)
        const res = await axios.post("/api/auth/create-user", formData, {
          headers,
        });
        if (res.status === 201) {
          fetchUsers();
          handleCloseCreateModal();
          handleCloseEditModal();

          // Show success message for user creation
          setSnackbarMessage("User created successfully");
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      // Handle backend validation errors
      if (error.response && error.response.data.errors) {
        const messages = error.response.data.errors.map((err) => err.msg);
        setErrorMessages(messages); // Display backend validation errors
      } else if (error.response && error.response.data.message) {
        setErrorMessages([error.response.data.message]); // Display general error message
      } else {
        setErrorMessages(["Server error, please try again later."]);
      }
    }
  };

  const confirmDeleteUser = (userId) => {
    setConfirmationModal({
      open: true,
      title: "Delete User",
      content: "Are you sure you want to delete this user?",
      onConfirm: async () => {
        try {
          await axios.delete(`/api/auth/users/${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` }, // Include JWT token
          });
          fetchUsers();

          // Show the snackbar
          setSnackbarMessage("User deleted successfully");
          setSnackbarOpen(true);
        } catch (error) {
          console.error("Error deleting user:", error);
        } finally {
          setConfirmationModal({ open: false });
        }
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Typography variant="h4">Manage Users</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateModal}
        >
          Create User
        </Button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                {u.name}
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                {u.email}
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                {u.role}
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ marginRight: 8 }}
                  onClick={() => handleOpenEditModal(u)} // Open edit modal and pass the user data
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => confirmDeleteUser(u._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create User */}
      <Modal
        open={openCreateModal || openEditModal}
        onClose={
          openCreateModal ? handleCloseCreateModal : handleCloseEditModal
        }
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {editingUser ? "Edit User" : "Create User"}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
            error={!!errorMessages.find((msg) => msg.includes("Name"))}
            helperText={errorMessages.find((msg) => msg.includes("Name"))}
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
            required
            error={!!errorMessages.find((msg) => msg.includes("Email"))}
            helperText={errorMessages.find((msg) => msg.includes("Email"))}
          />
          {/* Password field only shown when creating a user */}
          {!editingUser && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              margin="normal"
              required
              error={!!errorMessages.find((msg) => msg.includes("Password"))}
              helperText={errorMessages.find((msg) => msg.includes("Password"))}
            />
          )}
          <TextField
            fullWidth
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
            required
            error={!!errorMessages.find((msg) => msg.includes("Role"))}
            helperText={errorMessages.find((msg) => msg.includes("Role"))}
          />
          {errorMessages.length > 0 && (
            <Typography color="error" variant="body2" mt={2}>
              {errorMessages.join(", ")}
            </Typography>
          )}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
            <Button
              onClick={
                openCreateModal ? handleCloseCreateModal : handleCloseEditModal
              }
              variant="outlined"
              sx={{ marginLeft: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        content={confirmationModal.content}
        onClose={() => setConfirmationModal({ open: false })}
        onConfirm={confirmationModal.onConfirm}
      />

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Users;
