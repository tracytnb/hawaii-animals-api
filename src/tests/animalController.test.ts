import { pool } from '../config/db';
import supertest from 'supertest';
import app from '../app';
import { mockAnimals } from './fixtures/mockAnimals';

// Mock the database module so we don't actually connect to the database
jest.mock('../config/db', () => ({
  pool: { query: jest.fn() },
}));

describe('Animal Controller', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/animals', () => {
    it('returns 200 with data and pagination', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ count: mockAnimals.length }] })
        .mockResolvedValueOnce({ rows: mockAnimals });

      const res = await supertest(app).get('/api/animals');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
    });

    it('returns 200 with empty array when DB returns no rows', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ count: 0 }] })
        .mockResolvedValueOnce({ rows: [] });

      const res = await supertest(app).get('/api/animals');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.data).toEqual([]);
    });

    it('accepts query parameters: category, island_found, native_status, search, page, limit, sort, order', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ count: 2 }] })
        .mockResolvedValueOnce({ rows: mockAnimals });

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
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
    });

    it('returns 400 when native_status is invalid', async () => {
      const res = await supertest(app).get(
        '/api/animals?native_status=invalid',
      );

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
});
