import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const Tasks = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('assigned');
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [receivedTasks, setReceivedTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: '',
    dueDate: '',
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: '',
    dueDate: '',
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const [assignedRes, receivedRes] = await Promise.all([
        axios.get('/api/tasks/assigned'),
        axios.get('/api/tasks/received'),
      ]);
      setAssignedTasks(assignedRes.data);
      setReceivedTasks(receivedRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers('');
    try {
      const res = await axios.get('/api/auth/all-users');
      let filteredUsers = res.data;

      if (user.role === 'Principal') {
        filteredUsers = filteredUsers.filter(u => u.role.startsWith('HOD'));
      } else if (user.role.startsWith('HOD')) {
        const department = user.role.split('-')[1];
        filteredUsers = filteredUsers.filter(u => u.role === `Faculty-${department}`);
      }

      // Exclude self
      filteredUsers = filteredUsers.filter(u => u._id !== user._id);

      setUsers(filteredUsers);
    } catch (error) {
      console.error(error);
      setErrorUsers('Failed to load users.');
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
      await axios.post('/api/tasks', createFormData);
      fetchTasks();
      setShowCreateForm(false);
      setCreateFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: '',
        dueDate: '',
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, editFormData);
      fetchTasks();
      setEditTaskId(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.put(`api/tasks/${taskId}/complete`, { status: "Completed" });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error.response?.data || error.message);
    }
  };
  

  const startEditing = (task) => {
    setEditTaskId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0], // format date
    });
  };

  const cancelEditing = () => {
    setEditTaskId(null);
  };

  const renderTask = (task, isAssigned) => (
    <div key={task._id} className="task-item">
      {editTaskId === task._id ? (
        <form onSubmit={() => handleEditTask(task._id)}>
          <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleEditInputChange}
            placeholder="Title"
            required
          />
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleEditInputChange}
            placeholder="Description"
          />
          <select
            name="assignedTo"
            value={editFormData.assignedTo}
            onChange={handleEditInputChange}
            required
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
          />
          <button type="submit">Save</button>
          <button type="button" onClick={cancelEditing}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Assigned To: {task.assignedTo.name}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          <p>status: {task.status}</p>
          <div className="task-actions">
            {isAssigned && (
              <>
                <button onClick={() => startEditing(task)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteTask(task._id)}>
                  <FaTrash />
                </button>
              </>
            )}
            {!isAssigned && !task.completed && (
              <button onClick={() => handleCompleteTask(task._id)}>
                <FaCheck />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="tasks-container">
      <div className="tabs">
        <button onClick={() => setActiveTab('assigned')} className={activeTab === 'assigned' ? 'active' : ''}>
          Assigned Tasks
        </button>
        <button onClick={() => setActiveTab('received')} className={activeTab === 'received' ? 'active' : ''}>
          Received Tasks
        </button>
      </div>

      <div className="task-list">
        {activeTab === 'assigned' &&
          assignedTasks.map(task => renderTask(task, true))
        }
        {activeTab === 'received' &&
          receivedTasks.map(task => renderTask(task, false))
        }
      </div>

      <div className="create-task">
        {showCreateForm ? (
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              name="title"
              value={createFormData.title}
              onChange={handleCreateInputChange}
              placeholder="Title"
              required
            />
            <textarea
              name="description"
              value={createFormData.description}
              onChange={handleCreateInputChange}
              placeholder="Description"
            />
            <select
              name="assignedTo"
              value={createFormData.assignedTo}
              onChange={handleCreateInputChange}
              required
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
            />
            <button type="submit">Create Task</button>
            <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
          </form>
        ) : (
          <button onClick={() => setShowCreateForm(true)}>Create New Task</button>
        )}
      </div>
    </div>
  );
};

export default Tasks;