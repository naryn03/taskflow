const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { taskValidation, updateTaskValidation } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(taskValidation, createTask);
router.route('/:id').get(getTask).put(updateTaskValidation, updateTask).delete(deleteTask);

module.exports = router;
