// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { useAuth } from "../contexts/AuthContext";
// import SummaryCard from "../components/SummaryCard";
// import TaskModal from "../components/TaskModal";
// import { FaClock, FaTasks } from "react-icons/fa";

// const Dashboard = () => {
//   const { user } = useAuth();

//   const [assignedPendingTasks, setAssignedPendingTasks] = useState([]);
//   const [receivedPendingTasks, setReceivedPendingTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       if (user.role !== "Faculty") {
//         const assignedRes = await axios.get("/api/tasks/assigned");
//         const assignedPending = assignedRes.data.filter(
//           (task) => task.status === "Pending"
//         );
//         setAssignedPendingTasks(assignedPending);
//       }

//       if (user.role !== "Principal") {
//         const receivedRes = await axios.get("/api/tasks/received");
//         const receivedPending = receivedRes.data.filter(
//           (task) => task.status === "Pending"
//         );
//         setReceivedPendingTasks(receivedPending);
//       }
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await axios.delete(`/api/tasks/${taskId}`);
//       closeTaskModal();
//       fetchTasks();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const handleEditTask = async (taskData) => {
//     try {
//       await axios.put(`/api/tasks/${taskData._id}`, taskData);
//       closeTaskModal();
//       fetchTasks();
//     } catch (error) {
//       console.error("Error editing task:", error);
//     }
//   };

//   const handleMarkCompleted = async (taskId) => {
//     try {
//       await axios.put(`/api/tasks/${taskId}/complete`, { status: "Completed" });
//       closeTaskModal();
//       fetchTasks();
//     } catch (error) {
//       console.error("Error marking task as completed:", error);
//     }
//   };

//   const openTaskModal = (task) => setSelectedTask(task);
//   const closeTaskModal = () => setSelectedTask(null);

//   return (
//     <div className="p-6 space-y-6 border">
//       <h1 className="text-2xl font-bold">
//         Welcome, {user?.name} ({user?.role})
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {user.role !== "Faculty" && (
//           <SummaryCard
//             icon={<FaTasks />}
//             title="Pending Assigned Tasks"
//             count={assignedPendingTasks.length}
//           />
//         )}
//         {user.role !== "Principal" && (
//           <SummaryCard
//             icon={<FaClock />}
//             title="Pending Received Tasks"
//             count={receivedPendingTasks.length}
//           />
//         )}
//       </div>

//       {/* Pending Tasks Lists */}
//       <div className="mt-6">
//         {user.role !== "Faculty" && (
//           <div className="mb-4">
//             <h2 className="text-lg font-semibold mb-2">
//               Pending Assigned Tasks
//             </h2>
//             <ul className="space-y-2">
//               {assignedPendingTasks.map((task) => (
//                 <li
//                   key={task._id}
//                   className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
//                   onClick={() => openTaskModal(task)}
//                 >
//                   {task.title}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {user.role !== "Principal" && (
//           <div>
//             <h2 className="text-lg font-semibold mb-2">
//               Pending Received Tasks
//             </h2>
//             <ul className="space-y-2">
//               {receivedPendingTasks.map((task) => (
//                 <li
//                   key={task._id}
//                   className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
//                   onClick={() => openTaskModal(task)}
//                 >
//                   {task.title}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Task Modal */}
//       <TaskModal
//         isOpen={!!selectedTask}
//         onClose={closeTaskModal}
//         task={selectedTask}
//         refreshTasks={fetchTasks} // ✅ Add this line
//         isAssignedByUser={selectedTask?.assignedBy._id === user._id}
//         isAssignedToUser={selectedTask?.assignedTo._id === user._id}
//       />
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "../../api/axios";
// import { useAuth } from "../../contexts/AuthContext";
// import SummaryCard from "../../components/SummaryCard";
// import TaskModal from "../../components/TaskModal";
// import {
//   FaClock,
//   FaTasks,
//   FaUsers,
//   FaBuilding,
//   FaUserTie,
//   FaChalkboardTeacher,
// } from "react-icons/fa";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const { user } = useAuth();

//   const [assignedPendingTasks, setAssignedPendingTasks] = useState([]);
//   const [receivedPendingTasks, setReceivedPendingTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const [adminStats, setAdminStats] = useState(null);
//   const [hierarchyData, setHierarchyData] = useState(null);

//   useEffect(() => {
//     if (user.role === "Admin") {
//       fetchAdminStats();
//       fetchHierarchy();
//     } else {
//       fetchTasks();
//     }
//   }, []);

//   const fetchAdminStats = async () => {
//     try {
//       const res = await axios.get("/api/auth/stats");
//       setAdminStats(res.data);
//     } catch (error) {
//       console.error("Error fetching admin stats:", error);
//     }
//   };

//   const fetchHierarchy = async () => {
//     try {
//       const res = await axios.get("/api/auth/hierarchy");
//       setHierarchyData(res.data);
//     } catch (error) {
//       console.error("Error fetching hierarchy:", error);
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       if (user.role !== "Faculty") {
//         const assignedRes = await axios.get("/api/tasks/assigned");
//         const assignedPending = assignedRes.data.filter(
//           (task) => task.status === "Pending"
//         );
//         setAssignedPendingTasks(assignedPending);
//       }

//       if (user.role !== "Principal") {
//         const receivedRes = await axios.get("/api/tasks/received");
//         const receivedPending = receivedRes.data.filter(
//           (task) => task.status === "Pending"
//         );
//         setReceivedPendingTasks(receivedPending);
//       }
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   const openTaskModal = (task) => setSelectedTask(task);
//   const closeTaskModal = () => setSelectedTask(null);

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await axios.delete(`/api/tasks/${taskId}`);
//       closeTaskModal();
//       fetchTasks();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const handleEditTask = async (taskData) => {
//     try {
//       await axios.put(`/api/tasks/${taskData._id}`, taskData);
//       closeTaskModal();
//       fetchTasks();
//     } catch (error) {
//       console.error("Error editing task:", error);
//     }
//   };

//   const handleMarkCompleted = async (taskId) => {
//     try {
//       await axios.put(`/api/tasks/${taskId}/complete`, { status: "Completed" });
//       closeTaskModal();
//       fetchTasks();
//     } catch (error) {
//       console.error("Error marking task as completed:", error);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-header">
//         Welcome, {user?.name}{" "}
//         <span className="dashboard-subtext">({user?.role})</span>
//       </h1>

//       {user.role === "Admin" && (
//         <>
//           <div className="card-grid card-grid-4">
//             <SummaryCard
//               icon={<FaUsers />}
//               title="Total Users"
//               count={adminStats?.totalUsers || 0}
//             />
//             <SummaryCard
//               icon={<FaBuilding />}
//               title="Total Departments"
//               count={adminStats?.totalDepartments || 0}
//             />
//             <SummaryCard
//               icon={<FaUserTie />}
//               title="Total HODs"
//               count={adminStats?.totalHODs || 0}
//             />
//             <SummaryCard
//               icon={<FaChalkboardTeacher />}
//               title="Total Faculty"
//               count={adminStats?.totalFaculty || 0}
//             />
//           </div>

//           {hierarchyData && (
//             <div className="card-section">
//               <h2 className="section-title">Organizational Structure</h2>

//               <div className="structure-box">
//                 <p><strong>Principal:</strong> {hierarchyData.principal?.name}</p>
//                 <p>Email: {hierarchyData.principal?.email}</p>
//               </div>

//               {hierarchyData.departments.map((dept, index) => (
//                 <div key={index} className="department-box">
//                   <h3>{dept.department}</h3>
//                   <p className="mb-1">
//                     <strong>HOD:</strong>{" "}
//                     {dept.hod
//                       ? `${dept.hod.name} (${dept.hod.email})`
//                       : "No HOD listed"}
//                   </p>
//                   <ul className="list">
//                     {dept.faculty.length > 0 ? (
//                       dept.faculty.map((fac, i) => (
//                         <li key={i}>
//                           {fac.name} ({fac.email})
//                         </li>
//                       ))
//                     ) : (
//                       <li>No faculty listed</li>
//                     )}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {user.role !== "Admin" && (
//         <>
//           <div className="card-grid card-grid-3">
//             {user.role !== "Faculty" && (
//               <SummaryCard
//                 icon={<FaTasks />}
//                 title="Pending Assigned Tasks"
//                 count={assignedPendingTasks.length}
//               />
//             )}
//             {user.role !== "Principal" && (
//               <SummaryCard
//                 icon={<FaClock />}
//                 title="Pending Received Tasks"
//                 count={receivedPendingTasks.length}
//               />
//             )}
//           </div>

//           <div className="task-list">
//             {user.role !== "Faculty" && (
//               <div className="task-list-section">
//                 <h2 className="section-title">Pending Assigned Tasks</h2>
//                 <ul>
//                   {assignedPendingTasks.map((task) => (
//                     <li
//                       key={task._id}
//                       className="task-list-item"
//                       onClick={() => openTaskModal(task)}
//                     >
//                       {task.title}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {user.role !== "Principal" && (
//               <div className="task-list-section">
//                 <h2 className="section-title">Pending Received Tasks</h2>
//                 <ul>
//                   {receivedPendingTasks.map((task) => (
//                     <li
//                       key={task._id}
//                       className="task-list-item"
//                       onClick={() => openTaskModal(task)}
//                     >
//                       {task.title}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <TaskModal
//             isOpen={!!selectedTask}
//             onClose={closeTaskModal}
//             task={selectedTask}
//             refreshTasks={fetchTasks}
//             isAssignedByUser={selectedTask?.assignedBy._id === user._id}
//             isAssignedToUser={selectedTask?.assignedTo._id === user._id}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import SummaryCard from "../../components/SummaryCard";
import TaskModal from "../../components/TaskModal";
import {
  FaClock,
  FaTasks,
  FaUsers,
  FaBuilding,
  FaUserTie,
  FaChalkboardTeacher,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [assignedPendingTasks, setAssignedPendingTasks] = useState([]);
  const [receivedPendingTasks, setReceivedPendingTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [adminStats, setAdminStats] = useState(null);
  const [hierarchyData, setHierarchyData] = useState(null);

  useEffect(() => {
    if (user.role === "Admin") {
      fetchAdminStats();
      fetchHierarchy();
    } else {
      fetchTasks();
    }
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get("/api/auth/stats");
      setAdminStats(res.data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const fetchHierarchy = async () => {
    try {
      const res = await axios.get("/api/auth/hierarchy");
      setHierarchyData(res.data);
    } catch (error) {
      console.error("Error fetching hierarchy:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      if (user.role !== "Faculty") {
        const assignedRes = await axios.get("/api/tasks/assigned");
        const assignedPending = assignedRes.data.filter(
          (task) => task.status === "Pending"
        );
        setAssignedPendingTasks(assignedPending);
      }

      if (user.role !== "Principal") {
        const receivedRes = await axios.get("/api/tasks/received");
        const receivedPending = receivedRes.data.filter(
          (task) => task.status === "Pending"
        );
        setReceivedPendingTasks(receivedPending);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const openTaskModal = (task) => setSelectedTask(task);
  const closeTaskModal = () => setSelectedTask(null);

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await axios.put(`/api/tasks/${taskData._id}`, taskData);
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}/complete`, { status: "Completed" });
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">
        Welcome, {user?.name}{" "}
        <span className="role">({user?.role})</span>
      </h1>

      {user.role === "Admin" && (
        <>
          <div className="card-grid">
            <SummaryCard icon={<FaUsers />} title="Total Users" count={adminStats?.totalUsers || 0} />
            <SummaryCard icon={<FaBuilding />} title="Total Departments" count={adminStats?.totalDepartments || 0} />
            <SummaryCard icon={<FaUserTie />} title="Total HODs" count={adminStats?.totalHODs || 0} />
            <SummaryCard icon={<FaChalkboardTeacher />} title="Total Faculty" count={adminStats?.totalFaculty || 0} />
          </div>

          {hierarchyData && (
            <div className="hierarchy">
              <h2 className="subheading">Organizational Structure</h2>

              <div className="principal-card">
                <p><strong>Principal:</strong> {hierarchyData.principal?.name}</p>
                <p>Email: {hierarchyData.principal?.email}</p>
              </div>

              {hierarchyData.departments.map((dept, index) => (
                <div key={index} className="department-card">
                  <h3>{dept.department}</h3>
                  <p><strong>HOD:</strong> {dept.hod ? `${dept.hod.name} (${dept.hod.email})` : "No HOD listed"}</p>
                  <ul>
                    {dept.faculty.length > 0
                      ? dept.faculty.map((fac, i) => (
                          <li key={i}>{fac.name} ({fac.email})</li>
                        ))
                      : <li>No faculty listed</li>}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {user.role !== "Admin" && (
        <>
          <div className="card-grid">
            {user.role !== "Faculty" && (
              <SummaryCard icon={<FaTasks />} title="Pending Assigned Tasks" count={assignedPendingTasks.length} />
            )}
            {user.role !== "Principal" && (
              <SummaryCard icon={<FaClock />} title="Pending Received Tasks" count={receivedPendingTasks.length} />
            )}
          </div>

          <div className="task-section">
            {user.role !== "Faculty" && (
              <div className="task-list">
                <h2 className="subheading">Pending Assigned Tasks</h2>
                <ul>
                  {assignedPendingTasks.map((task) => (
                    <li key={task._id} onClick={() => openTaskModal(task)}>{task.title}</li>
                  ))}
                </ul>
              </div>
            )}
            {user.role !== "Principal" && (
              <div className="task-list">
                <h2 className="subheading">Pending Received Tasks</h2>
                <ul>
                  {receivedPendingTasks.map((task) => (
                    <li key={task._id} onClick={() => openTaskModal(task)}>{task.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <TaskModal
            isOpen={!!selectedTask}
            onClose={closeTaskModal}
            task={selectedTask}
            refreshTasks={fetchTasks}
            isAssignedByUser={selectedTask?.assignedBy._id === user._id}
            isAssignedToUser={selectedTask?.assignedTo._id === user._id}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
