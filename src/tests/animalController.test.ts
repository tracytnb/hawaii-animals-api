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
        .mockResolvedValueOnce({ rows: [{ count: 2 }] }) // mock 2 rows returned
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
      expect(res.body.data).toHaveLength(2);
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

  // describe("GET /api/animals/:")
});
