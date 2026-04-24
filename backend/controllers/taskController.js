const { Op } = require('sequelize');
const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'DESC' } = req.query;

    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const tasks = await Task.findAll({
      where,
      order: [[sortField, sortOrder]],
    });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description || null,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Task created successfully.', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    await task.update({
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
    });

    res.json({ success: true, message: 'Task updated successfully.', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await task.destroy();

    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [total, pending, inProgress, completed] = await Promise.all([
      Task.count({ where: { userId } }),
      Task.count({ where: { userId, status: 'pending' } }),
      Task.count({ where: { userId, status: 'in_progress' } }),
      Task.count({ where: { userId, status: 'completed' } }),
    ]);

    res.json({
      success: true,
      stats: { total, pending, inProgress, completed },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats };
