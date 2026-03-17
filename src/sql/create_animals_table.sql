CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    common_name TEXT NOT NULL,
    hawaiian_name TEXT,
    scientific_name TEXT NOT NULL,
    category TEXT NOT NULL,
    island_found TEXT,
    native_status TEXT NOT NULL CHECK (native_status IN ('native', 'endemic', 'introduced')),
    conservation_status TEXT,
    description TEXT
);