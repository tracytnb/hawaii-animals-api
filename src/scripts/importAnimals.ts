import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../config/db';
import { Animal } from '../models/animal';

const rawDataFolder = path.join(__dirname, '../data/raw');

function normalizeAnimal(row: Record<string, string>): Animal {
  return {
    common_name: row.common_name?.trim() || '',
    hawaiian_name: row.hawaiian_name?.trim() || '',
    scientific_name: row.scientific_name?.trim() || '',
    category: row.category?.trim().toLowerCase() || 'unknown',
    animal_class: row.animal_class?.trim() || '',
    habitat: row.habitat?.trim() || '',
    island_found: row.island_found?.trim()?.split(',') || [],
    native_status:
      (row.native_status?.trim().toLowerCase() as
        | 'native'
        | 'endemic'
        | 'introduced'
        | 'invasive') || 'unknown',
    conservation_status: row.conservation_status?.trim() || 'unknown',
    description: row.description?.trim() || 'unknown',
  } as Animal;
}

function readCsvFile(filePath: string): Promise<Animal[]> {
  return new Promise((resolve, reject) => {
    const animals: Animal[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const normalized = normalizeAnimal(row);
          animals.push(normalized);
        } catch (error) {
          console.error(`Error normalizing row in ${filePath}:`, error);
        }
      })
      .on('end', () => resolve(animals))
      .on('error', reject);
  });
}

async function insertAnimals(animals: Animal[]): Promise<void> {
  for (const animal of animals) {
    await pool.query(
      `
            INSERT INTO animals (
                common_name,
                hawaiian_name,
                scientific_name,
                category,
                animal_class,
                habitat,
                island_found,
                native_status,
                conservation_status,
                description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `,
      [
        animal.common_name,
        animal.hawaiian_name,
        animal.scientific_name,
        animal.category,
        animal.animal_class,
        animal.habitat,
        animal.island_found,
        animal.native_status,
        animal.conservation_status,
        animal.description,
      ],
    );
  }
}

async function importAllCsvFiles() {
  try {
    const files = fs
      .readdirSync(rawDataFolder)
      .filter((file) => file.endsWith('.csv'));
    let allAnimals: Animal[] = [];

    for (const file of files) {
      const filePath = path.join(rawDataFolder, file);
      console.log(`Reading ${file}...`);
      const animalsFromFile = await readCsvFile(filePath);
      allAnimals = allAnimals.concat(animalsFromFile);
    }

    console.log(`Parsed ${allAnimals.length} animals total.`);

    await insertAnimals(allAnimals);
    console.log('Import complete!');
  } catch (error) {
    console.error('Import failed: ', error);
  } finally {
    await pool.end();
  }
}

importAllCsvFiles();
