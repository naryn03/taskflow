import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, SlidersHorizontal, ListTodo, Clock, Loader2, CheckCircle2, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, fetchTasks, fetchStats, createTask, updateTask, deleteTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchTasks(filters);
    fetchStats();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((p) => ({ ...p, search: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: p[key] === value ? '' : value }));
  };

  const handleCreate = async (data) => {
    setSaving(true);
    try { await createTask(data); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try { await updateTask(editTask.id, data); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
  };

  const handleStatusChange = async (id, data) => {
    await updateTask(id, data);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Here's what's on your plate today.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatsCard label="Total Tasks" value={stats.total} color="blue" icon={LayoutGrid} />
          <StatsCard label="Pending" value={stats.pending} color="yellow" icon={Clock} />
          <StatsCard label="In Progress" value={stats.inProgress} color="purple" icon={Loader2} />
          <StatsCard label="Completed" value={stats.completed} color="green" icon={CheckCircle2} />
        </div>

        {/* Filters */}
        <div className="card p-3 mb-4 flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1 min-w-48 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tasks..."
                className="input pl-8 py-1.5 text-xs"
              />
            </div>
            <button type="submit" className="btn-secondary py-1.5 px-3 text-xs">Search</button>
          </form>

          <div className="flex items-center gap-1.5 flex-wrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            {['pending', 'in_progress', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => handleFilterChange('status', s)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  filters.status === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            {['low', 'medium', 'high'].map((p) => (
              <button
                key={p}
                onClick={() => handleFilterChange('priority', p)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  filters.priority === p ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
            {(filters.status || filters.priority || filters.search) && (
              <button
                onClick={() => { setFilters({ status: '', priority: '', search: '' }); setSearchInput(''); }}
                className="text-xs px-2.5 py-1 rounded-full text-red-500 bg-red-50 hover:bg-red-100 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">No tasks found</p>
            <p className="text-slate-400 text-sm mt-1">
              {filters.status || filters.priority || filters.search
                ? 'Try changing your filters.'
                : 'Create your first task to get started!'}
            </p>
            {!filters.status && !filters.priority && !filters.search && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={closeModal}
          onSubmit={editTask ? handleUpdate : handleCreate}
          loading={saving}
        />
      )}
    </div>
  );
};

export default Dashboard;
