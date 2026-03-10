import { Router } from 'express';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} from '../controllers/animalController';

const router = Router();

// Export the router
module.exports = router;

// GET all animals Method
router.get('/animals', getAnimals);

// GET a single animal by ID Method
router.get('/animals/:id', getAnimalById);

// POST a new animal Method
router.post('/', createAnimal);

// UPDATE an animal by ID Method
router.put('/:id', updateAnimal);

// DELETE an animal by ID Method
router.delete('/:id', deleteAnimal);

export default router;
