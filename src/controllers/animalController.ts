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
    // Get query parameters
    const category = req.query.category || '';
    const islandFound = req.query.island_found || '';
    const nativeStatus = req.query.native_status || '';
    const search = req.query.search || '';
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const sort = req.query.sort || 'created_at';
    const order = req.query.order || 'desc';

    // Define allowed columns and sort order
    const ALLOWED_COLUMNS = ['category', 'island_found', 'native_status'];
    const sortColumn = ALLOWED_COLUMNS.includes(String(sort));
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    // Initialize arrays
    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // Add conditions to query if they are present in the query parameters
    if (category) {
      conditions.push(`category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }

    if (nativeStatus) {
      conditions.push(`native_status = $${paramIndex}`);
      values.push(nativeStatus);
      paramIndex++;
    }

    if (islandFound) {
      conditions.push(`island_found @> $${paramIndex}::jsonb`);
      values.push(JSON.stringify([islandFound]));
      paramIndex++;
    }

    if (search) {
      conditions.push(
        `(common_name ILIKE $${paramIndex} OR hawaiian_name ILIKE $${paramIndex} OR scientific_name ILIKE $${paramIndex} OR COALESCE(description, '') ILIKE $${paramIndex})`,
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Build WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Build base query
    const baseQuery = `SELECT * FROM animals ${whereClause}`;
    // Build paginated query
    const paginatedQuery = `${baseQuery} ORDER BY ${sortColumn} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    // Build count query
    const countQuery = `SELECT COUNT(*)::int FROM animals ${whereClause}`;
    // Execute count query
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = countResult.rows[0].count;

    const result = await pool.query(paginatedQuery, values);

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [
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
