import { Router } from 'express';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} from '../controllers/animalController';
import { validate } from '../middlewares/validate';
import {
  createAnimalValidation,
  getAnimalsValidation,
  getAnimalByIdValidation,
  updateAnimalValidation,
  deleteAnimalByIdValidation,
} from '../validators/animalValidators';

const router = Router();

// GET all animals Method
router.get('/animals', getAnimalsValidation, validate, getAnimals);

// GET a single animal by ID Method
router.get('/animals/:id', getAnimalByIdValidation, validate, getAnimalById);

// POST a new animal Method
router.post('/animals', createAnimalValidation, validate, createAnimal);

// UPDATE an animal by ID Method
router.put('/animals/:id', updateAnimalValidation, validate, updateAnimal);

// DELETE an animal by ID Method
router.delete(
  '/animals/:id',
  deleteAnimalByIdValidation,
  validate,
  deleteAnimal,
);

export default router;
