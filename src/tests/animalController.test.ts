import { pool } from '../config/db';
import supertest from 'supertest';
import app from '../app';
import { mockAnimals } from './fixtures/mockAnimals';

// Mock the database module so we don't actually connect to the database
jest.mock('../config/db', () => ({
  pool: { query: jest.fn() }, // fake function that does nothing by default
  // Control what jest.fn() it returns
}));

describe('Animal Controller', () => {
  // Clears mock call history and return values so tests don't affect each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/animals', () => {
    it('returns 200 with data and pagination', async () => {
      // Cast to jest.Mock so we can use mock methods
      (pool.query as jest.Mock)
        // pool.query is called twice in getAnimals
        .mockResolvedValueOnce({ rows: [{ count: mockAnimals.length }] }) // mock the count query
        .mockResolvedValueOnce({ rows: mockAnimals }); // mock the paginated query

      // Send a GET request to the /api/animals endpoint
      const res = await supertest(app).get('/api/animals');

      // Assert that the response has a 200 status
      expect(res.status).toBe(200);
      // Assert that the response has a data property
      expect(res.body).toHaveProperty('data');
      // Assert that the response has a pagination property
      expect(res.body).toHaveProperty('pagination');
    });

    it('returns 200 with empty array when DB returns no rows', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ count: 0 }] }) // mock 0 rows returned
        .mockResolvedValueOnce({ rows: [] }); // mock empty array

      // Send a GET request to the /api/animals endpoint
      const res = await supertest(app).get('/api/animals');

      expect(res.status).toBe(200);
      // Assert that the response has a data property
      expect(res.body).toHaveProperty('data');
      // Assert that the response has a pagination property
      expect(res.body).toHaveProperty('pagination');
      // Assert that the response data is an empty array
      expect(res.body.data).toEqual([]);
    });

    it('accepts query parameters: category, island_found, native_status, search, page, limit, sort, order', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ count: 10 }] }) // mock 10 rows returned
        .mockResolvedValueOnce({ rows: mockAnimals }); // mock the paginated query

      // Send a GET request to the /api/animals endpoint with query parameters
      // .query() adds params to the URL e.g.
      // /api/animals?category=bird&island_found=hawaii&native_status=endemic&search=nene&page=2&limit=5&sort=common_name&order=asc
      const res = await supertest(app).get('/api/animals').query({
        category: 'bird',
        island_found: 'hawaii',
        native_status: 'endemic',
        search: 'nene',
        page: '2',
        limit: '5',
        sort: 'common_name',
        order: 'asc',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      // Assert that the response reflects the query params
      expect(res.body.data).toHaveLength(10);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
    });

    it('returns 400 when native_status is invalid', async () => {
      // Send a GET request to the /api/animals endpoint with an invalid native_status
      const res = await supertest(app).get(
        '/api/animals?native_status=invalid',
      );

      // No mock needed, validation runs before the controller, so DB is never called

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);

      // Check that the error mentions native_status
      const nativeStatusError = res.body.errors.find(
        (e: { path?: string }) => e.path === 'native_status',
      );
      expect(nativeStatusError).toBeDefined();
    });
  });

  describe('GET /api/animals/:id', () => {
    it('returns 200 with animal data when ID exists', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAnimals });

      // Send a GET request to the /api/animals/:id endpoint
      const res = await supertest(app).get('/api/animals/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('common_name');
      expect(res.body).toHaveProperty('hawaiian_name');
      expect(res.body).toHaveProperty('scientific_name');
      expect(res.body).toHaveProperty('category');
      expect(res.body.id).toBe(1);
    });

    it('returns 404 when ID does not exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const res = await supertest(app).get('/api/animals/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Animal not found');
    });
  });

  describe('POST /api/animals', () => {
    it('returns 201 with new animal data when valid data is provided', async () => {
      const createdAnimal = {
        id: mockAnimals.length + 1,
        common_name: 'Test Animal',
        hawaiian_name: 'Hawaiian Name Test Animal',
        scientific_name: 'Scientific Name Test Animal',
        category: 'Test Category',
        animal_class: 'Test Animal Class',
        habitat: 'Test Habitat',
        island_found: ['Test Island'],
        native_status: 'native',
        conservation_status: 'Test Conservation Status',
        diet: 'Test Diet',
        description: 'Test Description',
        image_url: 'https://example.com/test.jpg',
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [createdAnimal],
      });

      // Send a POST request to the /api/animals endpoint with valid data
      const res = await supertest(app)
        .post('/api/animals')
        .send({
          common_name: 'Test Animal',
          hawaiian_name: 'Hawaiian Name Test Animal',
          scientific_name: 'Scientific Name Test Animal',
          category: 'Test Category',
          animal_class: 'Test Animal Class',
          habitat: 'Test Habitat',
          island_found: ['oahu'],
          native_status: 'native',
          conservation_status: 'Test Conservation Status',
          // diet: omit entirely
          description: 'Test Description',
          // image_url: omit entirely
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toBe(createdAnimal.id);
      expect(res.body).toHaveProperty('common_name');
      expect(res.body).toHaveProperty('hawaiian_name');
      expect(res.body).toHaveProperty('scientific_name');
      expect(res.body).toHaveProperty('category');
    });

    it('returns 400 when invalid data is provided', async () => {
      // No mock needed - validation fails before controller runs
      const res = await supertest(app).post('/api/animals').send({
        common_name: '', // Missing required field
        hawaiian_name: 'Hawaiian Name Test Animal',
        scientific_name: 'Scientific Name Test Animal',
        category: 'Test Category',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe('PUT /api/animals/:id', () => {
    it('returns 200 with updated animal data when valid data is provided', async () => {
      const updatedAnimal = {
        ...mockAnimals[0],
        common_name: 'Updated Animal',
        hawaiian_name: 'Updated Hawaiian Name',
        scientific_name: 'Updated Scientific Name',
        category: 'Updated Category',
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedAnimal] });

      const res = await supertest(app).put('/api/animals/1').send({
        common_name: 'Updated Animal',
        hawaiian_name: 'Updated Hawaiian Name',
        scientific_name: 'Updated Scientific Name',
        category: 'Updated Category',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toBe(1);
      expect(res.body).toHaveProperty('common_name');
      expect(res.body.common_name).toBe('Updated Animal');
      expect(res.body).toHaveProperty('hawaiian_name');
      expect(res.body.hawaiian_name).toBe('Updated Hawaiian Name');
      expect(res.body).toHaveProperty('scientific_name');
      expect(res.body.scientific_name).toBe('Updated Scientific Name');
      expect(res.body).toHaveProperty('category');
      expect(res.body.category).toBe('Updated Category');
    });

    it('returns 400 when invalid data is provided', async () => {
      // No mock needed - validation fails before controller runs
      const res = await supertest(app).put('/api/animals/1').send({
        common_name: 'Updated Animal',
        hawaiian_name: '', // Missing required field
        scientific_name: 'Updated Scientific Name',
        category: 'Updated Category',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);

      const hawaiianNameError = res.body.errors.find(
        (e: { path?: string }) => e.path === 'hawaiian_name',
      );
      expect(hawaiianNameError).toBeDefined();
    });

    it('returns 404 when ID does not exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // UPDATE returns 0 rows when not found

      const res = await supertest(app).put('/api/animals/999').send({
        common_name: 'Updated Animal',
        hawaiian_name: 'Updated Hawaiian Name',
        scientific_name: 'Updated Scientific Name',
        category: 'Updated Category',
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Animal not found');
    });
  });

  describe('DELETE /api/animals/:id', () => {
    it('returns 200 with deleted animal when ID exists', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockAnimals[0]],
      }); // DELETE RETURNING * returns the deleted row

      const res = await supertest(app).delete('/api/animals/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toBe(1);
    });

    it('returns 404 when ID does not exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // DELETE returns 0 rows when not found

      const res = await supertest(app).delete('/api/animals/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Animal not found');
    });
  });
});
