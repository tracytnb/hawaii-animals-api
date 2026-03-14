import { body, param, query } from 'express-validator';

// POST /animals - create animal
export const createAnimalValidation = [
  body('common_name').trim().notEmpty().withMessage('Common name is required'),
  body('hawaiian_name')
    .trim()
    .notEmpty()
    .withMessage('Hawaiian name is required'),
  body('scientific_name')
    .trim()
    .notEmpty()
    .withMessage('Scientific name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('animal_class').optional().trim(),
  body('habitat').optional().trim(),
  body('island_found')
    .optional()
    .isArray()
    .withMessage('island_found must be an array'),
  body('native_status')
    .optional()
    .isIn(['native', 'endemic', 'introduced', 'invasive']),
  body('conservation_status').optional().trim(),
  body('diet').optional().trim(),
  body('description').optional().trim(),
  body('image_url').optional().isURL().withMessage('image_url image URL'),
];

// PUT /animals/:id - update animal
export const updateAnimalValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  ...createAnimalValidation.map((rule) => rule.optional().trim().notEmpty()),
];

// GET /animals - query params (all optional)
export const getAnimalsValidation = [
  query('category').optional().trim(),
  query('island_found').optional().trim(),
  query('native_status')
    .optional()
    .isIn(['native', 'endemic', 'introduced', 'invasive']),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort')
    .optional()
    .isIn([
      'created_at',
      'common_name',
      'scientific_name',
      'category',
      'native_status',
    ]),
  query('order').optional().isIn(['asc', 'desc']),
];

// GET /animals/:id - param validation
export const getAnimalByIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

// DELETE /animals/:id - param validation
export const deleteAnimalByIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];
