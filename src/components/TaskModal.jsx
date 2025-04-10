import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const TaskModal = ({ isOpen, onClose, task, refreshTasks, isAssignedByUser }) => {
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: '',
    dueDate: '',
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title || '',
        description: task.description || '',
        assignedTo: task.assignedTo || '',
        priority: task.priority || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    }
    fetchUsers();
  }, [task]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/all-users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/tasks/${task._id}`, editFormData);
      refreshTasks();
      onClose();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${task._id}`);
      refreshTasks();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await axios.patch(`/api/tasks/${task._id}`, { status: 'Completed' });
      refreshTasks();
      onClose();
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60
">
      <div className="bg-white w-full max-w-lg mx-4 rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Task Details</h2>

        {isAssignedByUser ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Assigned To</label>
              <select
                name="assignedTo"
                value={editFormData.assignedTo}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Priority</label>
              <input
                type="text"
                name="priority"
                value={editFormData.priority}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={editFormData.dueDate}
                onChange={handleEditChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div className="flex justify-between gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                <FaEdit className="inline mr-2" /> Update Task
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                <FaTrash className="inline mr-2" /> Delete Task
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleMarkComplete}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                <FaCheck className="inline mr-2" /> Mark as Completed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
