# Import the dependencies
# import numpy as np
# import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

import numpy as np
import pandas as pd

from flask import Flask, jsonify, render_template

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

# Calculate the date one year from the last date in data set for later use
# most_recent = session.query(Measurement.date).\
#     order_by(Measurement.date.desc()).first().date
# one_year = dt.datetime.strptime(most_recent, '%Y-%m-%d') - dt.timedelta(days=365)

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

    # Perform a query to retrieve the epidemiology table data
    # epi_results = session.query(Epidemiology.location_key).all()
    """
    epi_results = session.query(Epidemiology.location_key,
                                Epidemiology.date,
                                Epidemiology.new_confirmed,
                                Epidemiology.new_deceased,
                                Epidemiology.new_recovered,
                                Epidemiology.new_tested,
                                Epidemiology.cumulative_confirmed
                                ).all()
    # print(epi_results)
    
    # close session
    session.close()
    """



    # Store results as a dictionary accessible for JSON
    """
    #epi_dict = dict(epi_results)
    print("type(epi_results):")
    print(type(epi_results))
    print(epi_results[0])
    print(type(epi_results[0]))
    
    #sample = epi_results[0].__dict__
    #sample = dict(epi_results[0])
    #print(sample)
    """

    sql_df = pd.read_sql("SELECT location_key, date, new_confirmed, new_deceased FROM epidemiology;", con=engine)

    #print("sql_df:")
    #print(sql_df)

    #data = sql_df.to_dict()

    payload = list()
    #print(sql_df)
    #print(sql_df['location_key'])

    
    for idx, row in sql_df.iterrows():
        
        sample_data = {
            "location_key": row['location_key'],
            "date": row['date'],
            "new_confirmed": row['new_confirmed'],
            "new_deceased": row['new_deceased']
        }
    

        payload.append(sample_data)

    #print(payload)
    


 
    

    # Print results to terminal
    """
    print()
    print(f"The US epidemiology results:")
    print()
    print(epi_dict)
    print()
    print(f"---- RESULTS COMPLETE ----")
    print()
    """

    # Return results for server call
    #return jsonify(epi_dict)
    return jsonify(payload)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# Returns json with date as the key and value as the precipitation for last year in database
# @app.route("/api/v1.0/precipitation")
# def precipitation():
    
#     # print call acknowledgment to terminal
#     print()
#     print("Server received request for 'Precipitation' page...")
#     print()

#     # Perform a query to retrieve the date and precipitation scores.
#     prcp_results = session.query(Measurement.date, Measurement.prcp).\
#                                 filter(Measurement.date >= one_year).\
#                                 order_by(Measurement.date).all()

#     # close session
#     session.close()

#     # Store results as a dictionary accessible for JSON
#     prcp_dict = dict(prcp_results)

#     # Print results to terminal
#     print()
#     print(f"Precipitation data for the last year:")
#     print()
#     print(prcp_dict)
#     print()
#     print(f"---- RESULTS COMPLETE ----")
#     print()

#     # Return results for server call
#     return jsonify(prcp_dict)

# # Returns jsonified data of all of the stations in the database    
# @app.route("/api/v1.0/stations")
# def stations():
    
#     # print call acknowledgment to terminal
#     print()
#     print("Server received request for 'Stations' page...")
#     print()

#     # query station data
#     stations = session.query(Station.station).all()

#     # close session
#     session.close()

#     # store station data in accessible form for JSON
#     station_list = list(np.ravel(stations))

#     # Print results to terminal
#     print()
#     print(f"The list of stations:")
#     print()
#     print(station_list)
#     print()
#     print(f"---- RESULTS COMPLETE ----")
#     print()

#     # Return results for server call
#     return jsonify(station_list)

# # Returns jsonified TOBS data for the most active station (USC00519281) for the last year
# @app.route("/api/v1.0/tobs")
# def tobs():
    
#     # print call acknowledgment to terminal
#     print()
#     print("Server received request for 'TOBS' page...")
#     print()

#     # query temperature observations for most active station
#     one_year_tobs = session.query(Measurement.date, Measurement.tobs).\
#                 filter(Measurement.station == 'USC00519281').\
#                 filter(Measurement.date > one_year).all()
    
#     # close session
#     session.close()

#     # store results as a dictionary accessible for JSON
#     tobs_dict = dict(one_year_tobs)

#     # Print results to terminal
#     print()
#     print(f"Temperature observations for station USC00519281 for the last year:")
#     print()
#     print(tobs_dict)
#     print()
#     print(f"---- RESULTS COMPLETE ----")
#     print()

#     # Return results for server call
#     return jsonify(tobs_dict)

# # Return a JSON list of the minimum temperature, the average temperature,
# # and the maximum temperature for a specified start
# @app.route("/api/v1.0/<start>")
# def start(start):
    
#     # print call acknowledgment to terminal
#     print()
#     print(f"Server received request for 'TOBS' page with start date of: {start}")
#     print()

#     # ensure start from URL parameter is in datetime format (not string)
#     start = dt.datetime.strptime(start, "%Y%m%d")

#     # query data since provided start date
#     tobs_start = session.query(func.min(Measurement.tobs),\
#                     func.max(Measurement.tobs),\
#                     func.avg(Measurement.tobs)).\
#                     filter(Measurement.date >= start).all()
    
#     # close session
#     session.close()

#     # store station data in accessible form for JSON
#     tobs_start_list = list(np.ravel(tobs_start))

#     # Print results to terminal
#     print()
#     print(f"Minimum, maximum and average temperature observations since {start}:")
#     print()
#     print(tobs_start_list)
#     print()
#     print(f"---- RESULTS COMPLETE ----")
#     print()

#     # Return results for server call
#     return jsonify(tobs_start_list)

# # Return a JSON list of the minimum temperature, the average temperature,
# # and the maximum temperature for a specified start-end range
# @app.route("/api/v1.0/<start>/<end>")
# def start_end(start, end):
    
#     # print call acknowledgment to terminal
#     print()
#     print(f"Server received request for 'TOBS' page with start date of: {start}")
#     print()
    
#     # ensure start from URL parameter is in datetime format (not string)
#     start = dt.datetime.strptime(start, "%Y%m%d")
#     end = dt.datetime.strptime(end, "%Y%m%d")

#     # query min, max and average TOBS from given start date to end date
#     tobs_start_end = session.query(func.min(Measurement.tobs),\
#                     func.max(Measurement.tobs),\
#                     func.avg(Measurement.tobs)).\
#                     filter(Measurement.date >= start).\
#                     filter(Measurement.date <= end).all()
    
#     # close session
#     session.close()

#     # store station data in accessible form for JSON
#     tobs_start_end_list = list(np.ravel(tobs_start_end))

#     # Return results for server call
#     return jsonify(tobs_start_end_list)
    
