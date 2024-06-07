# Import the dependencies

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

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

# Create a session
session = Session(bind=engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

# Landing page for available routes
@app.route("/")
def welcome():
    return render_template("covidEndpoints.html")

# Returns COVID epidemiology JSON data for the United States
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)