// import React, { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";

// const TasksAssignedToMe = () => {
//   const { token } = useAuth();
//   const [tasksAssignedToMe, setTasksAssignedToMe] = useState([]);

// //   useEffect(() => {
// //     if (!token) return;

// //     fetch("http://localhost:5000/api/tasks/received", {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         "Content-Type": "application/json",
// //       },
// //     })
// //       .then(res => res.json())
// //       .then(data => setTasksAssignedToMe(data))
// //       .catch(error => console.error(error));
// //   }, [token]);

//     useEffect(() => {
//         if (!token) {
//         console.warn("No token found, skipping fetch");
//         return;
//         }
    
//         const fetchData = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/api/tasks/received", {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             });
//             if (!response.ok) {
//             console.error("Fetch error status:", response.status);
//             setTasksAssignedToMe([]);
//             return;
//             }
//             const data = await response.json();
//             console.log("Response data:", data);
//             setTasksAssignedToMe(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Fetch error:", error);
//             setTasksAssignedToMe([]);
//         }
//         };
    
//         fetchData();
//     }, [token]);
  

//   const total = Array.isArray(tasksAssignedToMe) ? tasksAssignedToMe.length : 0;
//   const pending = Array.isArray(tasksAssignedToMe)
//     ? tasksAssignedToMe.filter(task => task.status === "Pending").length
//     : 0;
//   const completed = Array.isArray(tasksAssignedToMe)
//     ? tasksAssignedToMe.filter(task => task.status === "Completed").length
//     : 0;

//   return (
//     <div>
//       <h2>Tasks Assigned To Me</h2>
//       <p>Total: {total}</p>
//       <p>Pending: {pending}</p>
//       <p>Completed: {completed}</p>
//     </div>
//   );
// };

// export default TasksAssignedToMe;


import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const TasksAssignedToMe = () => {
  const { token } = useAuth();
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    if (!token) {
      console.warn("No token found, skipping fetch");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/received", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Fetch error status:", response.status);
          setPendingTasks([]);
          return;
        }

        const data = await response.json();
        console.log("Response data:", data);

        const pending = Array.isArray(data)
          ? data.filter(task => task.status === "Pending")
          : [];

        setPendingTasks(pending);
      } catch (error) {
        console.error("Fetch error:", error);
        setPendingTasks([]);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Pending Tasks Assigned To Me</h2>
      {pendingTasks.length === 0 ? (
        <p>No pending tasks assigned to you.</p>
      ) : (
        <ul>
          {pendingTasks.map(task => (
            <li key={task._id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>Title:</strong> {task.title}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksAssignedToMe;
