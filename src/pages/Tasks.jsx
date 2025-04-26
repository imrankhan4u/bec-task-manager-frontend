// import React, { useEffect, useState } from 'react';
// import axios from '../api/axios';
// import { useAuth } from '../contexts/AuthContext';
// import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
// import { Navigate } from 'react-router-dom';

// const Tasks = () => {
//   const { user } = useAuth();

//   const [activeTab, setActiveTab] = useState('assigned');
//   const [assignedTasks, setAssignedTasks] = useState([]);
//   const [receivedTasks, setReceivedTasks] = useState([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [createFormData, setCreateFormData] = useState({
//     title: '',
//     description: '',
//     assignedTo: '',
//     priority: '',
//     dueDate: '',
//   });
//   const [editTaskId, setEditTaskId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     title: '',
//     description: '',
//     assignedTo: '',
//     priority: '',
//     dueDate: '',
//   });

//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [errorUsers, setErrorUsers] = useState('');

//   useEffect(() => {
//     fetchTasks();
//     fetchUsers();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const [assignedRes, receivedRes] = await Promise.all([
//         axios.get('/api/tasks/assigned'),
//         axios.get('/api/tasks/received'),
//       ]);
//       setAssignedTasks(assignedRes.data);
//       setReceivedTasks(receivedRes.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchUsers = async () => {
//     setLoadingUsers(true);
//     setErrorUsers('');
//     try {
//       const res = await axios.get('/api/auth/all-users');
//       let filteredUsers = res.data;

//       if (user.role === 'Principal') {
//         filteredUsers = filteredUsers.filter(u => u.role.startsWith('HOD'));
//       } else if (user.role.startsWith('HOD')) {
//         const department = user.role.split('-')[1];
//         filteredUsers = filteredUsers.filter(u => u.role === `Faculty-${department}`);
//       }

//       // Exclude self
//       filteredUsers = filteredUsers.filter(u => u._id !== user._id);

//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error(error);
//       setErrorUsers('Failed to load users.');
//     } finally {
//       setLoadingUsers(false);
//     }
//   };
//   const handleCreateInputChange = (e) => {
//     const { name, value } = e.target;
//     setCreateFormData({ ...createFormData, [name]: value });
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({ ...editFormData, [name]: value });
//   };

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/tasks', createFormData);
//       fetchTasks();
//       setShowCreateForm(false);
//       setCreateFormData({
//         title: '',
//         description: '',
//         assignedTo: '',
//         priority: '',
//         dueDate: '',
//       });
//     } catch (error) {
//       console.error('Error creating task:', error);
//     }
//   };

//   const handleEditTask = async (taskId) => {
//     try {
//       await axios.put(`/api/tasks/${taskId}`, editFormData);
//       fetchTasks();
//       setEditTaskId(null);
//     } catch (error) {
//       console.error('Error editing task:', error);
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await axios.delete(`/api/tasks/${taskId}`);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleCompleteTask = async (taskId) => {
//     try {
//       await axios.put(`api/tasks/${taskId}/complete`, { status: "Completed" });
//       fetchTasks();
//     } catch (error) {
//       console.error('Error completing task:', error.response?.data || error.message);
//     }
//   };

//   const startEditing = (task) => {
//     setEditTaskId(task._id);
//     setEditFormData({
//       title: task.title,
//       description: task.description,
//       assignedTo: task.assignedTo,
//       priority: task.priority,
//       dueDate: task.dueDate.split('T')[0], // format date
//     });
//   };

//   const cancelEditing = () => {
//     setEditTaskId(null);
//   };

//   const renderTask = (task, isAssigned) => (
//     <div key={task._id} className="task-item">
//       {editTaskId === task._id ? (
//         <form onSubmit={() => handleEditTask(task._id)}>
//           <input
//             type="text"
//             name="title"
//             value={editFormData.title}
//             onChange={handleEditInputChange}
//             placeholder="Title"
//             required
//           />
//           <textarea
//             name="description"
//             value={editFormData.description}
//             onChange={handleEditInputChange}
//             placeholder="Description"
//           />
//           <select
//             name="assignedTo"
//             value={editFormData.assignedTo}
//             onChange={handleEditInputChange}
//             required
//           >
//             <option value="">Assign to</option>
//             {users.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.name} ({u.role})
//               </option>
//             ))}
//           </select>
//           <select
//             name="priority"
//             value={editFormData.priority}
//             onChange={handleEditInputChange}
//             required
//           >
//             <option value="">Priority</option>
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//           <input
//             type="date"
//             name="dueDate"
//             value={editFormData.dueDate}
//             onChange={handleEditInputChange}
//             required
//           />
//           <button type="submit">Save</button>
//           <button type="button" onClick={cancelEditing}>
//             Cancel
//           </button>
//         </form>
//       ) : (
//         <div>
//           <h3>{task.title}</h3>
//           <p>{task.description}</p>
//           <p>Priority: {task.priority}</p>
//           <p>Assigned To: {task.assignedTo.name}</p>
//           <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
//           <p>status: {task.status}</p>
//           <div className="task-actions">
//             {isAssigned && (
//               <>
//                 <button onClick={() => startEditing(task)}>
//                   <FaEdit />
//                 </button>
//                 <button onClick={() => handleDeleteTask(task._id)}>
//                   <FaTrash />
//                 </button>
//               </>
//             )}
//             {!isAssigned && !task.completed && (
//               <button onClick={() => handleCompleteTask(task._id)}>
//                 <FaCheck />
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Restrict access to tasks for Admin users
//   if (user.role === 'Admin') {
//     return <Navigate to="/unauthorized" />;
//   }

//   return (
//     <div className="tasks-container">
//       <div className="tabs">
//         <button onClick={() => setActiveTab('assigned')} className={activeTab === 'assigned' ? 'active' : ''}>
//           Assigned Tasks
//         </button>
//         <button onClick={() => setActiveTab('received')} className={activeTab === 'received' ? 'active' : ''}>
//           Received Tasks
//         </button>
//       </div>

//       <div className="task-list">
//         {activeTab === 'assigned' &&
//           assignedTasks.map(task => renderTask(task, true))
//         }
//         {activeTab === 'received' &&
//           receivedTasks.map(task => renderTask(task, false))
//         }
//       </div>

//       <div className="create-task">
//         {showCreateForm ? (
//           <form onSubmit={handleCreateTask}>
//             <input
//               type="text"
//               name="title"
//               value={createFormData.title}
//               onChange={handleCreateInputChange}
//               placeholder="Title"
//               required
//             />
//             <textarea
//               name="description"
//               value={createFormData.description}
//               onChange={handleCreateInputChange}
//               placeholder="Description"
//             />
//             <select
//               name="assignedTo"
//               value={createFormData.assignedTo}
//               onChange={handleCreateInputChange}
//               required
//             >
//               <option value="">Assign to</option>
//               {users.map((u) => (
//                 <option key={u._id} value={u._id}>
//                   {u.name} ({u.role})
//                 </option>
//               ))}
//             </select>
//             <select
//               name="priority"
//               value={createFormData.priority}
//               onChange={handleCreateInputChange}
//               required
//             >
//               <option value="">Priority</option>
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//             <input
//               type="date"
//               name="dueDate"
//               value={createFormData.dueDate}
//               onChange={handleCreateInputChange}
//               required
//             />
//             <button type="submit">Create Task</button>
//             <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
//           </form>
//         ) : (
//           <button onClick={() => setShowCreateForm(true)}>Create New Task</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tasks;

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

const Tasks = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("assigned");
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [receivedTasks, setReceivedTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    dueDate: "",
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    dueDate: "",
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");

  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const [assignedRes, receivedRes] = await Promise.all([
        axios.get("/api/tasks/assigned"),
        axios.get("/api/tasks/received"),
      ]);
      setAssignedTasks(assignedRes.data);
      setReceivedTasks(receivedRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers("");
    try {
      const res = await axios.get("/api/auth/all-users");
      let filteredUsers = res.data;

      if (user.role === "Principal") {
        filteredUsers = filteredUsers.filter((u) => u.role.startsWith("HOD"));
      } else if (user.role.startsWith("HOD")) {
        const department = user.role.split("-")[1];
        filteredUsers = filteredUsers.filter(
          (u) => u.role === `Faculty-${department}`
        );
      }

      filteredUsers = filteredUsers.filter((u) => u._id !== user._id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error(error);
      setErrorUsers("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", createFormData);
      fetchTasks();
      setShowCreateForm(false);
      setCreateFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "",
        dueDate: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const ConfirmationModal = ({ open, title, message, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: 30,
            borderRadius: 8,
            width: "90%",
            maxWidth: 400,
          }}
        >
          <h2>{title}</h2>
          <p>{message}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <button
              onClick={onCancel}
              style={{
                padding: "8px 12px",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: 4,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: "8px 12px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleEditTask = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, editFormData);
      fetchTasks();
      setEditTaskId(null);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleDeleteTask = (taskId) => {
    setConfirmationModal({
      open: true,
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        try {
          await axios.delete(`/api/tasks/${taskId}`);
          fetchTasks();
        } catch (error) {
          console.error("Error deleting task:", error);
        } finally {
          setConfirmationModal({ open: false });
        }
      },
    });
  };

  const handleCompleteTask = (taskId) => {
    setConfirmationModal({
      open: true,
      title: "Complete Task",
      message: "Are you sure you want to mark this task as completed?",
      onConfirm: async () => {
        try {
          await axios.put(`/api/tasks/${taskId}/complete`, {
            status: "Completed",
          });
          fetchTasks();
        } catch (error) {
          console.error("Error completing task:", error);
        } finally {
          setConfirmationModal({ open: false });
        }
      },
    });
  };

  // const handleDeleteTask = async (taskId) => {
  //   try {
  //     await axios.delete(`/api/tasks/${taskId}`);
  //     fetchTasks();
  //   } catch (error) {
  //     console.error('Error deleting task:', error);
  //   }
  // };

  // const handleCompleteTask = async (taskId) => {
  //   try {
  //     await axios.put(`api/tasks/${taskId}/complete`, { status: "Completed" });
  //     fetchTasks();
  //   } catch (error) {
  //     console.error('Error completing task:', error.response?.data || error.message);
  //   }
  // };

  const startEditing = (task) => {
    setEditTaskId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo._id,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
    });
  };

  const cancelEditing = () => {
    setEditTaskId(null);
  };

  const renderTask = (task, isAssigned) => (
    <div
      key={task._id}
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        background: "#fff",
      }}
    >
      {editTaskId === task._id ? (
        <form onSubmit={() => handleEditTask(task._id)}>
          <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleEditInputChange}
            placeholder="Title"
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleEditInputChange}
            placeholder="Description"
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <select
            name="assignedTo"
            value={editFormData.assignedTo}
            onChange={handleEditInputChange}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          >
            <option value="">Assign to</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          <select
            name="priority"
            value={editFormData.priority}
            onChange={handleEditInputChange}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          >
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={editFormData.dueDate}
            onChange={handleEditInputChange}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={{ padding: 8 }}>
              <SaveIcon /> Save
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              style={{ padding: 8 }}
            >
              <CancelIcon /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Assigned To:</strong> {task.assignedTo?.name}
          </p>
          <p>
            <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
            {isAssigned && (
              <>
                <button
                  onClick={() => startEditing(task)}
                  title="Edit Task"
                  style={{
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    padding: 6,
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  title="Delete Task"
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    padding: 6,
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  <DeleteIcon />
                </button>
              </>
            )}
            {!isAssigned && task.status !== "Completed" && (
              <button
                onClick={() => handleCompleteTask(task._id)}
                title="Mark as Completed"
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  padding: 6,
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                <CheckCircleIcon />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (user.role === "Admin") {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <button
          onClick={() => setActiveTab("assigned")}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: activeTab === "assigned" ? "#1976d2" : "#f0f0f0",
            color: activeTab === "assigned" ? "#fff" : "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          Assigned Tasks
        </button>
        {user.role != "Principal" && (
          <button
            onClick={() => setActiveTab("received")}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: activeTab === "received" ? "#1976d2" : "#f0f0f0",
              color: activeTab === "received" ? "#fff" : "#333",
              border: "none",
              cursor: "pointer",
            }}
          >
            Received Tasks
          </button>
        )}
      </div>

      <div>
        {activeTab === "assigned" &&
          assignedTasks.map((task) => renderTask(task, true))}
        {activeTab === "received" &&
          receivedTasks.map((task) => renderTask(task, false))}
      </div>

      <div style={{ marginTop: 40 }}>
        {showCreateForm ? (
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              name="title"
              value={createFormData.title}
              onChange={handleCreateInputChange}
              placeholder="Title"
              required
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <textarea
              name="description"
              value={createFormData.description}
              onChange={handleCreateInputChange}
              placeholder="Description"
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <select
              name="assignedTo"
              value={createFormData.assignedTo}
              onChange={handleCreateInputChange}
              required
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            >
              <option value="">Assign to</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <select
              name="priority"
              value={createFormData.priority}
              onChange={handleCreateInputChange}
              required
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            >
              <option value="">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={createFormData.dueDate}
              onChange={handleCreateInputChange}
              required
              style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={{ padding: 8 }}>
                <SaveIcon /> Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{ padding: 8 }}
              >
                <CancelIcon /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#9c27b0",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <AddCircleIcon /> Create New Task
          </button>
        )}
      </div>

      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal({ open: false })}
      />
    </div>
  );
};

export default Tasks;
