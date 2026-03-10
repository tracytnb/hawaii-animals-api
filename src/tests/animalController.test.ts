import { Request, Response } from 'express';
import { getAnimals } from '../controllers/animalController';
import { animals } from '../models/animal';

describe('Animal Controller', () => {
  it('shoulder return an empty array when no items exist', () => {
    // Create mock objects for Request, Response, and NextFunction
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Ensure that our in-memory animals array is an empty state
    animals.length = 0;

    // Execute our controller function
    getAnimals(req, res, jest.fn());

    // Asset that it responds with an empty array
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
