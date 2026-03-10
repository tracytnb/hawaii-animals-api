import { Router } from "express";
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} from "../controllers/animalController";

const router = Router();

router.get("/", getAnimals);
router.get("/:id", getAnimalById);
router.post("/", createAnimal);
router.put("/:id", updateAnimal);
router.delete("/:id", deleteAnimal);

export default router;
