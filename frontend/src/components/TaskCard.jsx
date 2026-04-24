import { Trash2, Pencil, Calendar, ArrowRight } from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-green-50 text-green-700 border-green-100',
};

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-orange-50 text-orange-600',
  high: 'bg-red-50 text-red-600',
};

const NEXT_STATUS = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: null,
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const next = NEXT_STATUS[task.status];

  return (
    <div className={`card p-4 animate-fadeIn group transition-all duration-200 hover:shadow-md ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge border ${STATUS_STYLES[task.status]}`}>
              {STATUS_LABELS[task.status]}
            </span>
            <span className={`badge ${PRIORITY_STYLES[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
            </span>
          </div>

          <h3 className={`font-semibold text-slate-800 text-sm leading-snug ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>Due {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {next && (
            <button
              onClick={() => onStatusChange(task.id, { status: next })}
              title={`Mark as ${STATUS_LABELS[next]}`}
              className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
