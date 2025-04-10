// import { useAuth } from "../contexts/AuthContext";

// import TasksAssignedToMe from "../components/TasksAssignedToMe";
// import TasksAssignedByMe from "../components/TaskAssignedByMe";

// const Dashboard = () => {
//   const { user } = useAuth();

//   if (!user) {
//     return <div>Loading user info...</div>;
//   }

//   const mainRole = user.role.split("-")[0];

//   const showAssignedToMe = mainRole === "HOD" || mainRole === "Faculty";
//   const showAssignedByMe = mainRole === "HOD" || mainRole === "Principal";

//   return (
//     <div>
//       <h1>Dashboard</h1>

//       {showAssignedToMe && <TasksAssignedToMe />}
//       {showAssignedByMe && <TasksAssignedByMe />}
//     </div>
//   );
// };

// export default Dashboard;






// import React, { useEffect, useState } from 'react';
// import axios from '../api/axios';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { FaPlus, FaTasks, FaCheckCircle, FaClock } from 'react-icons/fa';
// import  Modal  from '../components/TaskModal'; // Assume you have or will create this Modal component

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [tasks, setTasks] = useState([]);
//   const [pendingTasks, setPendingTasks] = useState([]);
//   const [completedTasks, setCompletedTasks] = useState([]);
//   const [overdueTasks, setOverdueTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get('/api/tasks/received');
//       const allTasks = response.data;

//       const pending = allTasks.filter(task => task.status === 'Pending');
//       const completed = allTasks.filter(task => task.status === 'Completed');
//       const overdue = allTasks.filter(task => task.status === 'Pending' && new Date(task.dueDate) < new Date());

//       setTasks(allTasks);
//       setPendingTasks(pending);
//       setCompletedTasks(completed);
//       setOverdueTasks(overdue);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const openTaskModal = (task) => {
//     setSelectedTask(task);
//   };

//   const closeModal = () => {
//     setSelectedTask(null);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Greeting */}
//       <h1 className="text-2xl font-bold">Welcome, {user?.name} ({user?.role})</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <SummaryCard icon={<FaTasks />} title="Total Tasks" count={tasks.length} />
//         <SummaryCard icon={<FaClock />} title="Pending Tasks" count={pendingTasks.length} />
//         <SummaryCard icon={<FaCheckCircle />} title="Completed Tasks" count={completedTasks.length} />
//         <SummaryCard icon={<FaClock />} title="Overdue Tasks" count={overdueTasks.length} />
//       </div>

//       {/* Quick Actions */}
//       <div className="space-x-4">
//         <button onClick={() => navigate('/tasks')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           <FaTasks className="inline mr-2" /> View All Tasks
//         </button>
//         <button onClick={() => navigate('/create-task')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//           <FaPlus className="inline mr-2" /> Create Task
//         </button>
//       </div>

//       {/* Recent Pending Tasks */}
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Recent Pending Tasks</h2>
//         {pendingTasks.length === 0 ? (
//           <p className="text-gray-500">No pending tasks! 🎉</p>
//         ) : (
//           <ul className="space-y-2">
//             {pendingTasks.slice(0, 5).map(task => (
//               <li
//                 key={task._id}
//                 onClick={() => openTaskModal(task)}
//                 className="cursor-pointer bg-white p-3 rounded shadow hover:bg-gray-50 border"
//               >
//                 <strong>{task.title}</strong>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Modal */}
//       {selectedTask && (
//         <Modal onClose={closeModal}>
//           <div className="space-y-2">
//             <h2 className="text-xl font-bold">{selectedTask.title}</h2>
//             <p><strong>Description:</strong> {selectedTask.description}</p>
//             <p><strong>Status:</strong> {selectedTask.status}</p>
//             <p><strong>Priority:</strong> {selectedTask.priority}</p>
//             <p><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
//             <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
//               Close
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// const SummaryCard = ({ icon, title, count }) => (
//   <div className="bg-white p-4 rounded shadow text-center border">
//     <div className="text-2xl mb-2 text-gray-700">{icon}</div>
//     <div className="text-lg font-semibold">{title}</div>
//     <div className="text-2xl font-bold">{count}</div>
//   </div>
// );

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import SummaryCard from '../components/SummaryCard';
import TaskModal from '../components/TaskModal';
import { FaClock, FaTasks } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();

  const [assignedPendingTasks, setAssignedPendingTasks] = useState([]);
  const [receivedPendingTasks, setReceivedPendingTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      if (user.role !== 'Faculty') {
        const assignedRes = await axios.get('/api/tasks/assigned');
        const assignedPending = assignedRes.data.filter(task => task.status === 'Pending');
        setAssignedPendingTasks(assignedPending);
      }

      if (user.role !== 'Principal') {
        const receivedRes = await axios.get('/api/tasks/received');
        const receivedPending = receivedRes.data.filter(task => task.status === 'Pending');
        setReceivedPendingTasks(receivedPending);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await axios.put(`/api/tasks/${taskData._id}`, taskData);
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}/complete`);
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  const openTaskModal = (task) => setSelectedTask(task);
  const closeTaskModal = () => setSelectedTask(null);

  return (
    <div className="p-6 space-y-6 border">
      <h1 className="text-2xl font-bold">Welcome, {user?.name} ({user?.role})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {user.role !== 'Faculty' && (
          <SummaryCard icon={<FaTasks />} title="Assigned Pending" count={assignedPendingTasks.length} />
        )}
        {user.role !== 'Principal' && (
          <SummaryCard icon={<FaClock />} title="Received Pending" count={receivedPendingTasks.length} />
        )}
      </div>

      {/* Pending Tasks Lists */}
      <div className="mt-6">
        {user.role !== 'Faculty' && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Assigned Pending Tasks</h2>
            <ul className="space-y-2">
              {assignedPendingTasks.map(task => (
                <li
                  key={task._id}
                  className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => openTaskModal(task)}
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {user.role !== 'Principal' && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Received Pending Tasks</h2>
            <ul className="space-y-2">
              {receivedPendingTasks.map(task => (
                <li
                  key={task._id}
                  className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => openTaskModal(task)}
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={!!selectedTask}
        onClose={closeTaskModal}
        task={selectedTask}
        onDelete={user.role !== 'Faculty' && selectedTask?.assignedBy === user._id ? handleDeleteTask : null}
        onEdit={user.role !== 'Faculty' && selectedTask?.assignedBy === user._id ? handleEditTask : null}
        onMarkCompleted={user.role !== 'Principal' && selectedTask?.assignedTo === user._id ? handleMarkCompleted : null}
      />
    </div>
  );
};

export default Dashboard;
