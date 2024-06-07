-- If not in standard Python library, install sqlite3 module from terminal
% pip install sqlite

-- Run sqlite and create db from terminal
% sqlite3 us_covid.sqlite
-- Alternatively:
-- CREATE DATABASE us_covid.sqlite;

-- Create table with primary key composed of two columns
sqlite>
CREATE TABLE IF NOT EXISTS epidemiology (
	location_key VARCHAR(5) NOT NULL,
    date DATE  NOT NULL,
    new_confirmed INT,
    new_deceased INT,
    new_recovered INT,
    new_tested INT,
    cumulative_confirmed INT,
    cumulative_deceased INT,
    cumulative_recovered INT,
    cumulative_tested INT,
    PRIMARY KEY (location_key, date)
);

-- Confirm table creation and schema
sqlite> .table
sqlite> .schema

-- Import CSV dataset from file directory
-- “skip 1” ignores the CSV headers
sqlite> .import --csv --skip 1 US_epi_cleaned.csv epidemiology

-- Example queries to confirm successful import
SELECT * FROM epidemiology LIMIT(5);
SELECT * FROM epidemiology WHERE (location_key = 'US_CO') LIMIT(5);