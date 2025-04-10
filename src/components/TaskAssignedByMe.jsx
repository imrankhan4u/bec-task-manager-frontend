import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const TaskAssignedByMe = () => {
  const { token, loading } = useAuth();
  const [tasksAssignedByMe, setTasksAssignedByMe] = useState([]);

  useEffect(() => {
    if (loading) {
      console.log("Auth is still loading...");
      return;
    }

    if (!token) {
      console.warn("No token found, skipping fetch");
      return;
    }

    fetch("http://localhost:5000/api/tasks/assigned", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response data:", data);
        if (Array.isArray(data)) {
          setTasksAssignedByMe(data);
        } else {
          console.error("Expected array but got:", data);
          setTasksAssignedByMe([]);
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setTasksAssignedByMe([]);
      });
  }, [token, loading]); // 🔥 Add loading here!

  const total = tasksAssignedByMe.length;
  const pending = tasksAssignedByMe.filter(task => task.status === "Pending").length;
  const completed = tasksAssignedByMe.filter(task => task.status === "Completed").length;

  return (
    <div>
      <h2>Tasks Assigned By Me</h2>
      <p>Total: {total}</p>
      <p>Pending: {pending}</p>
      <p>Completed: {completed}</p>
    </div>
  );
};

export default TaskAssignedByMe;
