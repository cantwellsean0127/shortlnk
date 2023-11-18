-- Step 1: Install PostgreSQL on your machine
-- Step 2: Create a database for this application (make sure the name is identical to the name you set in the .env file)
-- Step 3: Execute this file by running "psql -f [path to seed.sql file] [database name]"
CREATE SEQUENCE shortened_url_sequence;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash CHAR(64) NOT NULL,
    password_salt CHAR(32) NOT NULL,
    session_id CHAR(64)
);

CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    shortened_url TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id)
);
