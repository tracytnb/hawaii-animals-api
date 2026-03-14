import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { Animal } from '../models/animal';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect().then(() => console.log('Connected to the database!'));
