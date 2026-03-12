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

  it('should return an empty array when no items exist', async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await getAnimals(req, res, next);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return all animals', async () => {
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

    (pool.query as jest.Mock).mockResolvedValue({ rows: mockAnimals });
    await getAnimals(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockAnimals);
  });
});
