import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats');
      setStats(data.stats);
    } catch {}
  }, []);

  const createTask = useCallback(async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    setTasks((prev) => [data.task, ...prev]);
    await fetchStats();
    toast.success('Task created!');
    return data.task;
  }, [fetchStats]);

  const updateTask = useCallback(async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    await fetchStats();
    toast.success('Task updated!');
    return data.task;
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetchStats();
    toast.success('Task deleted.');
  }, [fetchStats]);

  return { tasks, stats, loading, fetchTasks, fetchStats, createTask, updateTask, deleteTask };
};
