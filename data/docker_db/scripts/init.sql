-- TODO: Read/Pull Data and Instantiate Database

-- Create the places table
CREATE TABLE places (
    id SERIAL PRIMARY KEY,                          -- Auto-incremented unique ID for each place
    hash UUID DEFAULT uuid_generate_v4(),           -- Unique identifier, defaulting to a UUID
    name VARCHAR(255) NOT NULL,                     -- Name of the place
    address TEXT,                                   -- Full address or location details
    latitude DOUBLE PRECISION NOT NULL,             -- Latitude for geolocation
    longitude DOUBLE PRECISION NOT NULL,            -- Longitude for geolocation
    pricing_level INTEGER CHECK (pricing_level BETWEEN 1 AND 5), -- Pricing level on a 1-5 scale
    tags TEXT[],                                    -- Array of keywords/tags for categorization
    web_url TEXT                                    -- URL link to website
);

-- Index for fast geolocation queries, using latitude and longitude
CREATE INDEX idx_places_location ON places USING gist (ll_to_earth(latitude, longitude));