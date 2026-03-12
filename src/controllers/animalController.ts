import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

// Create a new animal
export const createAnimal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      common_name,
      hawaiian_name,
      scientific_name,
      category,
      animal_class,
      habitat,
      island_found,
      native_status,
      conservation_status,
      diet,
      description,
      image_url,
    } = req.body;

    const insertQuery = `INSERT INTO animals (
      common_name, hawaiian_name, scientific_name, category, animal_class,
      habitat, island_found, native_status, conservation_status, diet,
      description, image_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`;

    const result = await pool.query(insertQuery, [
      common_name,
      hawaiian_name,
      scientific_name,
      category,
      animal_class,
      habitat,
      island_found,
      native_status,
      conservation_status,
      diet,
      description,
      image_url,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Read all animals
export const getAnimals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await pool.query('SELECT * FROM animals');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Read a single animal by id
export const getAnimalById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update an animal
export const updateAnimal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const {
      common_name,
      hawaiian_name,
      scientific_name,
      category,
      animal_class,
      habitat,
      island_found,
      native_status,
      conservation_status,
      diet,
      description,
      image_url,
    } = req.body;

    const updateQuery = `UPDATE animals SET
      common_name = $1, hawaiian_name = $2, scientific_name = $3, category = $4,
      animal_class = $5, habitat = $6, island_found = $7, native_status = $8,
      conservation_status = $9, diet = $10, description = $11, image_url = $12
    WHERE id = $13
    RETURNING *`;

    const result = await pool.query(updateQuery, [
      common_name,
      hawaiian_name,
      scientific_name,
      category,
      animal_class,
      habitat,
      island_found,
      native_status,
      conservation_status,
      diet,
      description,
      image_url,
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete an animal
export const deleteAnimal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      'DELETE FROM animals WHERE id = $1 RETURNING *',
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
