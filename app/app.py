# Import dependencies

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
from flask_cors import CORS

import pandas as pd

#################################################
# Database Setup
#################################################

# Create engine using the `us_covid.sqlite` database file
engine = create_engine("sqlite:///us_covid.sqlite")

# Declare a Base using `automap_base()`
Base = automap_base()

# Use the Base class to reflect the database tables
Base.prepare(autoload_with=engine)

# Assign the epidemiology class to a variable called `Epidemiology'
Epidemiology = Base.classes.epidemiology
Demographic = Base.classes.demographic
Vaccination = Base.classes.vaccination
States = Base.classes.states

# Create a session
session = Session(bind=engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
# avoid cross origin blocking
CORS(app)

#################################################
# Flask Routes
#################################################

# Landing page for available routes
@app.route("/")
def welcome():
    return render_template("covidEndpoints.html")

# Returns COVID epidemiology data for the United States
@app.route("/api/v1.0/epidemiology_us")
def epidemiology_us():

    # print call acknowledgment to terminal
    print()
    print("Server received request for 'epidemiology_us' page...")
    print()

    # create Pandas df with SQL epidemiology table
    epi_sql_df = pd.read_sql("SELECT location_key,\
                            date,\
                            new_confirmed,\
                            new_deceased,\
                            new_recovered,\
                            new_tested,\
                            cumulative_confirmed,\
                            cumulative_deceased,\
                            cumulative_recovered,\
                            cumulative_tested\
                            FROM epidemiology;", con=engine)

    epi_payload = list()

    for idx, row in epi_sql_df.iterrows():
        
        epi_data = {
            "location_key": row['location_key'],
            "date": row['date'],
            "new_confirmed": row['new_confirmed'],
            "new_deceased": row['new_deceased'],
            "new_recovered": row['new_recovered'],
            "new_tested": row['new_tested'],
            "cumulative_confirmed": row['cumulative_confirmed'],
            "cumulative_deceased": row['cumulative_deceased'],
            "cumulative_recovered": row['cumulative_recovered'],
            "cumulative_tested": row['cumulative_tested']
        }
        epi_payload.append(epi_data)

    # close session
    session.close()

    # Return results for server call
    return jsonify(epi_payload)

# Returns COVID demographic data for the United States
@app.route("/api/v1.0/demographic_us")
def demographic_us():

    # print call acknowledgment to terminal
    print()
    print("Server received request for 'demographic_us' page...")
    print()

    # create Pandas df with SQL demographic table
    demo_sql_df = pd.read_sql("SELECT location_key,\
                            population,\
                            population_male,\
                            population_female\
                            FROM demographic;", con=engine)

    demo_payload = list()

    for idx, row in demo_sql_df.iterrows():
        
        demo_data = {
            "location_key": row['location_key'],
            "population": row['population'],
            "population_male": row['population_male'],
            "population_female": row['population_female']
        }
        demo_payload.append(demo_data)

    # close session
    session.close()

    # Return results for server call
    return jsonify(demo_payload)

# Returns COVID vaccination data for the United States
@app.route("/api/v1.0/vaccination_us")
def vaccination_us():

    # print call acknowledgment to terminal
    print()
    print("Server received request for 'vaccination_us' page...")
    print()

    # create Pandas df with SQL vaccination table
    vac_sql_df = pd.read_sql("SELECT location_key,\
                            date,\
                            new_persons_vaccinated,\
                            cumulative_persons_vaccinated,\
                            new_persons_fully_vaccinated,\
                            cumulative_persons_fully_vaccinated,\
                            new_vaccine_doses_administered,\
                            cumulative_vaccine_doses_administered\
                            FROM vaccination;", con=engine)

    vac_payload = list()

    for idx, row in vac_sql_df.iterrows():
        
        vac_data = {
            "location_key": row['location_key'],
            "date": row['date'],
            "new_persons_vaccinated": row['new_persons_vaccinated'],
            "cumulative_persons_vaccinated": row['cumulative_persons_vaccinated'],
            "new_persons_fully_vaccinated": row['new_persons_fully_vaccinated'],
            "cumulative_persons_fully_vaccinated": row['cumulative_persons_fully_vaccinated'],
            "new_vaccine_doses_administered": row['new_vaccine_doses_administered'],
            "cumulative_vaccine_doses_administered": row['cumulative_vaccine_doses_administered']
        }
        vac_payload.append(vac_data)

    # close session
    session.close()

    # Return results for server call
    return jsonify(vac_payload)

# Returns COVID US state data for the United States
@app.route("/api/v1.0/states")
def states():

    # print call acknowledgment to terminal
    print()
    print("Server received request for 'states' page...")
    print()

    # create Pandas df with SQL states table
    states_sql_df = pd.read_sql("SELECT location_key,\
                            state_name\
                            FROM states;", con=engine)

    states_payload = list()

    for idx, row in states_sql_df.iterrows():
        
        states_data = {
            "location_key": row['location_key'],
            "state": row['state_name']
        }
        states_payload.append(states_data)

    # close session
    session.close()

    # Return results for server call
    return jsonify(states_payload)

if __name__ == "__main__":
    app.run(debug=True, port=5000)