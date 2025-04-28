import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const TaskModal = ({
  isOpen,
  onClose,
  task,
  refreshTasks,
  isAssignedByUser,
  isAssignedToUser,
}) => {
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    dueDate: "",
  });

  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo || "",
        priority: task.priority || "",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
      fetchUsers();
    }
  }, [task]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/all-users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/tasks/${task._id}`, editFormData);
      refreshTasks();
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${task._id}`);
      refreshTasks();
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      await axios.patch(`/api/tasks/${task._id}`, { status: "Completed" });
      refreshTasks();
      onClose();
    } catch (error) {
      console.error("Error marking task as complete:", error);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <FaTimes />
        </button>

        <h2>Task Details</h2>

        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label>Assign To:</label>
              <select
                name="assignedTo"
                value={editFormData.assignedTo._id}
                onChange={handleEditChange}
                required
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Priority:</label>
              <select
                name="priority"
                value={editFormData.priority}
                onChange={handleEditChange}
                required
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={editFormData.dueDate}
                onChange={handleEditChange}
                required
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p>
              <strong>Title:</strong> {task.title}
            </p>
            <p>
              <strong>Description:</strong> {task.description}
            </p>
            {/* <p><strong>Assigned To:</strong> {task.assignedTo.name}</p>
             */}
            {task.assignedTo?.name ? (
              <p>
                <strong>Assigned To:</strong> {task.assignedTo.name}
              </p>
            ) : (
              <p>
                <strong>Assigned By:</strong> {task.assignedBy?.name}
              </p>
            )}

            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div style={{ marginTop: "20px" }}>
            {isAssignedByUser && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ marginRight: "10px" }}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{ color: "red", marginRight: "10px" }}
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
            {isAssignedToUser && (
              <button onClick={handleMarkAsComplete} style={{ color: "green" }}>
                <FaCheck /> Mark as Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple inline styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  position: "relative",
};

export default TaskModal;
