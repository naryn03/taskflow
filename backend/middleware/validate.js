const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be 1–255 characters.'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status value.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value.'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isDate().withMessage('Invalid date format.'),
  handleValidationErrors,
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 255 }).withMessage('Title too long.'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status value.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value.'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isDate().withMessage('Invalid date format.'),
  handleValidationErrors,
];

module.exports = { registerValidation, loginValidation, taskValidation, updateTaskValidation };
