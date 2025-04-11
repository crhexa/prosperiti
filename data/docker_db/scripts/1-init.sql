-- init.sql

-- Create the places table
CREATE TABLE places (
    id BIGSERIAL PRIMARY KEY,                                -- Unique ID
    name VARCHAR(255) NOT NULL,                              -- Name
    address TEXT,                                            -- Vicinity
    lat DOUBLE PRECISION NOT NULL,                           -- Latitude
    lng DOUBLE PRECISION NOT NULL,                           -- Longitude
    price_level INTEGER CHECK (price_level BETWEEN 1 AND 5), -- Price level
    rating DOUBLE PRECISION,                                 -- Rating
    tags TEXT[]                                              -- Types
);

