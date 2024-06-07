-- If not in standard Python library, install sqlite3 module from terminal
% pip install sqlite

-- Run sqlite and create db from terminal
% sqlite3 us_covid.sqlite
-- Alternatively:
-- CREATE DATABASE us_covid.sqlite;

-- Create table with primary key composed of two columns
sqlite>
CREATE TABLE IF NOT EXISTS epidemiology (
    location_key VARCHAR(2) NOT NULL,
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
sqlite> .import --csv --skip 1 ../resources/US_epi_cleaned.csv epidemiology

-- Example queries to confirm successful import
SELECT * FROM epidemiology LIMIT(5);
SELECT * FROM epidemiology WHERE (location_key = 'CO') LIMIT(5);

-- Repeat steps for creation of demographic table
sqlite>
CREATE TABLE IF NOT EXISTS demographic (
location_key VARCHAR(2) NOT NULL,
population INT,
population_male INT,
population_female INT,
population_age_00_09 INT,
population_age_10_19 INT,
population_age_20_29 INT,
population_age_30_39 INT,
population_age_40_49 INT,
population_age_50_59 INT,
population_age_60_69 INT,
population_age_70_79 INT,
population_age_80_and_older INT,
PRIMARY KEY (location_key)
);

-- Import CSV dataset from file directory
-- “skip 1” ignores the CSV headers
sqlite> .import --csv --skip 1 ../resources/us_demo_cleaned.csv demographic

-- Example queries to confirm successful import
SELECT * FROM demographic LIMIT(5);
SELECT * FROM demographic WHERE (location_key = 'CO') LIMIT(5);

-- Repeat steps for creation of vaccination table
sqlite>
CREATE TABLE IF NOT EXISTS vaccination (
location_key VARCHAR(2) NOT NULL,
date DATE  NOT NULL,
new_persons_vaccinated INT,
cumulative_persons_vaccinated INT,
new_persons_fully_vaccinated INT,
cumulative_persons_fully_vaccinated INT,
new_vaccine_doses_administered INT,
cumulative_vaccine_doses_administered INT,
new_persons_vaccinated_pfizer INT,
cumulative_persons_vaccinated_pfizer INT,
new_persons_fully_vaccinated_pfizer INT,
cumulative_persons_fully_vaccinated_pfizer INT,
new_vaccine_doses_administered_pfizer INT,
cumulative_vaccine_doses_administered_pfizer INT,
new_persons_vaccinated_moderna INT,
cumulative_persons_vaccinated_moderna INT,
new_persons_fully_vaccinated_moderna INT,
cumulative_persons_fully_vaccinated_moderna	INT,
new_vaccine_doses_administered_moderna INT,
cumulative_vaccine_doses_administered_moderna INT,
new_persons_vaccinated_janssen INT,
cumulative_persons_vaccinated_janssen INT,
new_persons_fully_vaccinated_janssen INT,
cumulative_persons_fully_vaccinated_janssen	INT,
new_vaccine_doses_administered_janssen INT,
cumulative_vaccine_doses_administered_janssen INT,
new_persons_vaccinated_sinovac INT,
total_persons_vaccinated_sinovac INT,
new_persons_fully_vaccinated_sinovac INT,
total_persons_fully_vaccinated_sinovac INT,
new_vaccine_doses_administered_sinovac INT,
total_vaccine_doses_administered_sinova INT,
PRIMARY KEY (location_key, date)
);

-- Confirm table creation and schema
sqlite> .table
sqlite> .schema

-- Import CSV dataset from file directory
-- “skip 1” ignores the CSV headers
sqlite> .import --csv --skip 1 ../resources/US_vac_cleaned.csv vaccination

-- Example queries to confirm successful import
SELECT * FROM vaccination LIMIT(5);
SELECT * FROM vaccination WHERE (location_key = 'CO') LIMIT(5);

-- Repeat steps for creation of states table
sqlite>
CREATE TABLE IF NOT EXISTS states (
location_key VARCHAR(2) NOT NULL,
state_name VARCHAR(25)  NOT NULL,
PRIMARY KEY (location_key, state_name)
);

-- Confirm table creation and schema
sqlite> .table
sqlite> .schema

-- Import CSV dataset from file directory
-- “skip 1” ignores the CSV headers
sqlite> .import --csv --skip 1 ../resources/states_cleaned.csv states

-- Example queries to confirm successful import
SELECT * FROM states LIMIT(5);
SELECT * FROM vaccination WHERE (location_key = 'CO');