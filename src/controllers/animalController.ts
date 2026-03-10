import { Request, Response, NextFunction } from "express";
import { animals, Animal } from "../models/animal";

// Create a new animal
export const createAnimal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { common_name } = req.body;
    const newAnimal: Animal = {
      id: Date.now(),
      common_name,
      hawaiian_name: "",
      scientific_name: "",
      category: "",
      animal_class: "",
      habitat: "",
      island_found: [],
      native_status: "native",
      conservation_status: "",
      diet: "",
      description: "",
      image_url: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    animals.push(newAnimal);
    res.status(201).json(newAnimal);
  } catch (error) {
    next(error);
  }
};

// Read all animals
export const getAnimals = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(animals);
  } catch (error) {
    next(error);
  }
};

// Read a single animal
export const getAnimalById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const animal = animals.find((a) => a.id === id);
    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    res.json(animal);
  } catch (error) {
    next(error);
  }
};

// Update an animal
export const updateAnimal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { common_name } = req.body;
    const animalIndex = animals.findIndex((a) => a.id === id);

    if (animalIndex === -1) {
      res.status(404).json({ message: "Animal not found " });
      return;
    }

    animals[animalIndex]!.common_name = common_name;
    res.json(animals[animalIndex]);
  } catch (error) {
    next(error);
  }
};

// Delete an animal
export const deleteAnimal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const animalIndex = animals.findIndex((a) => a.id === id);

    if (animalIndex === -1) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    const deletedAnimal = animals.splice(animalIndex, 1)[0];
    res.json(deletedAnimal);
  } catch (error) {
    next(error);
  }
};
