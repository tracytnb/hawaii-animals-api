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

/**
 * @swagger
 * components:
 *  schemas:
 *    Animal:
 *      type: object
 *      required:
 *        - common_name
 *        - hawaiian_name
 *        - scientific_name
 *        - category
 *      properties:
 *        id:
 *          type: integer
 *          description: The unique identifier for the animal
 *        common_name:
 *          type: string
 *          description: The common name of the animal
 *        hawaiian_name:
 *          type: string
 *          description: The Hawaiian name of the animal
 *        scientific_name:
 *          type: string
 *          description: The scientific name of the animal
 *        category:
 *          type: string
 *          description: The category of the animal
 *        animal_class:
 *          type: string
 *          description: The class of the animal
 *        habitat:
 *          type: string
 *          description: The habitat of the animal
 *        island_found:
 *          type: array
 *          description: The islands where the animal is found
 *        native_status:
 *          type: string
 *          description: The native status of the animal
 *        conservation_status:
 *          type: string
 *          description: The conservation status of the animal
 *        diet:
 *          type: string
 *          description: The diet of the animal
 *        description:
 *          type: string
 *          description: The description of the animal
 *        image_url:
 *          type: string
 *          description: The image URL of the animal
 *        created_at:
 *          type: string
 *          description: The date and time the animal was created
 *        updated_at:
 *          type: string
 *          description: The date and time the animal was updated
 *    AnimalList:
 *      type: object
 *      required:
 *        - data
 *        - pagination
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Animal'
 *        pagination:
 *          type: object
 *          properties:
 *            page:
 *              type: integer
 *              description: The page number
 *            limit:
 *              type: integer
 *              description: The number of items per page
 *            total:
 *              type: integer
 *              description: The total number of items
 *            totalPages:
 *              type: integer
 *              description: The total number of pages
 *      example:
 *        data:
 *          - id: 4
 *            common_name: "Hawksbill Sea Turtle"
 *            hawaiian_name: "ʻEa"
 *            scientific_name: "Eretmochelys imbricata"
 *            category: "reptile"
 *            animal_class: "sea turtle"
 *            habitat: "coral reefs, coastal waters"
 *            island_found: ["all main islands"]
 *            native_status: "native"
 *            conservation_status: "critically endangered"
 *            diet: "sponges, sea anemones, algae"
 *            description: "A rare sea turtle found in tropical oceans, including Hawaiian waters."
 *            image_url: "https://example.com/hawksbill.jpg"
 *            created_at: "2026-03-13T00:00:00.000Z"
 *            updated_at: "2026-03-13T00:00:00.000Z"
 *        pagination:
 *          page: 1
 *          limit: 10
 *          total: 1
 *          totalPages: 1
 *    Error:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: The error message
 */

const router = Router();

/**
 * @swagger
 * /api/animals:
 *   get:
 *     summary: Get all animals
 *     tags: [Animals]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of animals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimalList'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/animals', getAnimalsValidation, validate, getAnimals);

/**
 * @swagger
 * /api/animals/{id}:
 *   get:
 *     summary: Get a single animal by ID
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: The ID of the animal to get
 *     responses:
 *       200:
 *         description: The animal response by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Animal'
 *       404:
 *         description: Animal not found
 */
router.get('/animals/:id', getAnimalByIdValidation, validate, getAnimalById);

/**
 * @swagger
 * tags:
 *  name: Animals
 *  description: API endpoints for managing animals in Hawaii
 * /api/animals:
 *  post:
 *    summary: Create a new animal
 *    tags: [Animals]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Animal'
 *    responses:
 *      201:
 *        description: The created animal
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Animal'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post('/animals', createAnimalValidation, validate, createAnimal);

/**
 * @swagger
 * /api/animals/{id}:
 *   put:
 *     summary: Update the animal by the ID
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: The animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Animal'
 *     responses:
 *       200:
 *         description: The updated animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Animal'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/animals/:id', updateAnimalValidation, validate, updateAnimal);

/**
 * @swagger
 * /api/animals/{id}:
 *   delete:
 *     summary: Remove the animal by ID
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: The animal ID
 *     responses:
 *       200:
 *         description: The animal was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Animal'
 *       404:
 *         description: The animal was not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/animals/:id',
  deleteAnimalByIdValidation,
  validate,
  deleteAnimal,
);

export default router;
