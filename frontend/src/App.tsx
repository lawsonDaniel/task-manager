import React, { useState, useEffect } from 'react';
import * as Formik from 'formik';
import * as Yup from 'yup';
import TaskService from './services/TaskService';
import type { Status, Task } from './types/task.types';

const taskService = new TaskService();

const token = localStorage.getItem('authToken');
if (token) {
  taskService.setAuthToken(token);
}

interface FormValues {
  userId: string;
  title: string;
  description: string;
  status: Status | '';
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  'todo': { label: 'To Do', badge: 'bg-gray-200 text-gray-800', dot: 'bg-gray-500' },
  'in-progress': { label: 'In Progress', badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  'done': { label: 'Done', badge: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
};

const getStatusConfig = (status: string) => {
  const normalizedStatus = status?.toLowerCase();
  
  if (normalizedStatus && STATUS_CONFIG[normalizedStatus]) {
    return STATUS_CONFIG[normalizedStatus];
  }
  
  return {
    label: status || 'Unknown',
    badge: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400'
  };
};

const TaskForm = ({ onSubmit, isSubmitting }: { onSubmit: (values: FormValues) => void; isSubmitting: boolean }) => {
  const formik = Formik.useFormik<FormValues>({
    initialValues: {
      userId: '',
      title: '',
      description: '',
      status: ''
    },
    validationSchema: Yup.object({
      userId: Yup.string()
        .typeError('Must be a string')
        .required('User ID is required'),
      title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .required('Title is required'),
      description: Yup.string()
        .min(5, 'Description must be at least 5 characters')
        .max(500, 'Description must be less than 500 characters')
        .required('Description is required'),
      status: Yup.string()
        .oneOf(['todo', 'in-progress', 'done'], 'Please select a valid status')
        .required('Status is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  const inputCls = (hasError: boolean, touched: boolean) => {
    const error = hasError && touched;
    return `w-full border rounded px-3 py-2 text-sm outline-none
      ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          User ID
        </label>
        <input
          id="userId"
          type="text"
          name="userId"
          placeholder="e.g. 42"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.userId}
          className={inputCls(!!formik.errors.userId, !!formik.touched.userId)}
        />
        {formik.touched.userId && formik.errors.userId && (
          <span className="text-xs text-red-600 mt-1">{formik.errors.userId}</span>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Task title..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className={inputCls(!!formik.errors.title, !!formik.touched.title)}
        />
        {formik.touched.title && formik.errors.title && (
          <span className="text-xs text-red-600 mt-1">{formik.errors.title}</span>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="What needs to be done..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          rows={4}
          className={`${inputCls(!!formik.errors.description, !!formik.touched.description)} resize-none`}
        />
        {formik.touched.description && formik.errors.description && (
          <span className="text-xs text-red-600 mt-1">{formik.errors.description}</span>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.status}
          className={`${inputCls(!!formik.errors.status, !!formik.touched.status)} cursor-pointer`}
        >
          <option value="">Select status...</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        {formik.touched.status && formik.errors.status && (
          <span className="text-xs text-red-600 mt-1">{formik.errors.status}</span>
        )}
      </div>

      {isSubmitting && (
        <div className="text-center text-sm text-gray-600">Creating task...</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !formik.isValid || !formik.dirty}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Create Task
      </button>

      {formik.submitCount > 0 && !formik.isValid && (
        <div className="text-xs text-amber-600 text-center mt-2">
          Please fix the errors above before submitting
        </div>
      )}
    </form>
  );
};

function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("1");

  useEffect(() => {
    if (currentUserId) {
      loadTasks();
    }
  }, [currentUserId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasksByUserId(currentUserId);
      
      // Handle the response structure { success: true, data: {...} }
      let fetchedTasks = [];
      if (response && response.success && response.data) {
        // If response.data is an array
        fetchedTasks = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        // If response is directly an array
        fetchedTasks = response;
      } else if (response && response.data && !response.success) {
        // Handle other structures
        fetchedTasks = Array.isArray(response.data) ? response.data : [];
      } else {
        fetchedTasks = [];
      }
      
      console.log('Loaded tasks:', fetchedTasks);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const newTask = await taskService.createTask({
        userId: values.userId,
        title: values.title,
        description: values.description,
        status: values.status as Status,
      });
      
      // Handle response structure
      const taskData = newTask && newTask.data ? newTask.data : newTask;
      setTasks(prev => [taskData, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleCycleStatus = (id: string) => {
    const order: Status[] = ['todo', 'in-progress', 'done'];
    setTasks(prev => prev.map(t =>
      t.id !== id ? t : { ...t, status: order[(order.indexOf(t.status) + 1) % order.length] }
    ));
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUserId(e.target.value);
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">User ID:</label>
            <input
              type="text"
              value={currentUserId}
              onChange={handleUserIdChange}
              className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Enter user ID"
            />
          </div>
          <span className="text-sm text-gray-600">{tasks.length} tasks</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h2 className="text-lg font-semibold mb-4">New Task</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'todo', 'in-progress', 'done'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors
                  ${filter === s
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
                <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-black bg-opacity-10">
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-8 text-center text-gray-500">
              <div className="text-2xl mb-2">📋</div>
              <p>No tasks found</p>
              {filter !== 'all' && tasks.length > 0 && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Show all tasks
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(task => {
                const statusConfig = getStatusConfig(task.status);
                
                return (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded ${statusConfig.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">#{task.userId}</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{task.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Just now'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCycleStatus(task.id)} 
                          title="Change status"
                          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          ↻ Status
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)} 
                          title="Delete"
                          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;