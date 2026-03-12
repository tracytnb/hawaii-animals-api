import { Request, Response } from 'express';
import { getAnimals } from '../controllers/animalController';
import { pool } from '../config/db';

// Mock the database module so we don't actually connect to the database
jest.mock('../config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Animal Controller', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for empty array
  it('should return an empty array when no items exist', async () => {
    // Minimal request object
    const req = {} as Request;
    // Mocked res.json so we can assert on its calls
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Mock the next function
    const next = jest.fn();

    // Makes pool.query return a resolved promise with an empty array
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Run controller function
    await getAnimals(req, res, next);

    // Asserts that res.json was called with exactly []
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return all animals', async () => {
    // Fake data that matches what the controller would get from the DB
    const mockAnimals = [
      {
        id: 1,
        common_name: 'Nene',
        hawaiian_name: 'Nēnē',
        scientific_name: 'Branta sandvicensis',
        category: 'bird',
        animal_class: 'goose',
        habitat: 'grasslands, shrublands, volcanic slopes',
        island_found: ['hawaii, maui, kauai, molokai'],
        native_status: 'endemic',
        conservation_status: 'vulnerable',
        diet: 'grasses, seeds, leaves, berries',
        description:
          'The Nēnē is the state bird of Hawaiʻi and is found nowhere else in the world.',
        image_url: 'https://example.com/nene.jpg',
      },
    ];

    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    // Makes pool.query return a resolved promise with the mock animals
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockAnimals });

    // Runs the controller function
    await getAnimals(req, res, next);

    // Asserts that res.json was called with the mock animals
    expect(res.json).toHaveBeenCalledWith(mockAnimals);
  });
});
