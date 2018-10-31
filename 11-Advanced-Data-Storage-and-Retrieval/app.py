
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
import numpy as np
from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start><end>"
    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a list of dates and precipitation"""
    # Query observations from the last year
    #last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    #last_year = dt.date(2017,8,23) - dt.timedelta(days=365)
    results = session.query(Measurement.date, Measurement.prcp).\
        filter(Measurement.date >= "2016-08-23").\
        order_by(Measurement.date).all()

    # Convert to dictionary list
    observation = [{'Date': row[0], 'Precipitation':row[1]} for row in results]
    
    return jsonify(observation)


@app.route("/api/v1.0/stations")
def stations():
    """Return a list of stations"""
    # Query stations from the last year
    stations = session.query(Station.name, Station.station).all()

    # Create stations list
    station_list = []
    for station in stations:
        station_dict = {}
        station_dict['name'] = station[0]
        station_dict['station'] = station[1]
        station_list.append(station_dict)

    return jsonify(station_list)

@app.route("/api/v1.0/tobs")
def tobs():
    """Return a list of temperature from last year"""
    # Query temperature from the last year
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    last_year = dt.date(2017,8,23) - dt.timedelta(days=365)
    sel = [Station.name, Station.station, Measurement.date, Measurement.prcp]
    results = session.query(*sel).filter(Measurement.station == Station.station).\
        filter(Measurement.date >= last_year).\
        order_by(Measurement.date).all()

    # Creats tobs list
    tobs = [{'Name':row[0], 'Station':row[1], 'Date':row[2], 'Temperature':row[3]} for row in results]

    return jsonify(tobs)

@app.route("/api/v1.0/<start_date>")
def start(start_date):
    """Return the TMIN, TAVG, TMAX for start date"""
    # Query information for given start date
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).all()
    # date_list = list(np.ravel(results))
    # Create start_date list
    date_list = []
    #for result in results:
    date_dict = {}
    date_dict['Start Date'] = start_date
    date_dict['Average Temperature'] = results[0][1]
    date_dict['Highest Temperature'] = results[0][2]
    date_dict['Lowest Temperature'] = results[0][0]
    date_list.append(date_dict)
    
    return jsonify(date_list)

@app.route("/api/v1.0/<start_date>/<end_date>")
def start_end(start_date, end_date):
    """Return the TMIN, TAVG, TMAX for a time period"""
    # Query information for given date
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start_date).filter(Measurement.date <= end_date).all()

    # Create start_date list
    date_list = []
    for result in results:
        date_dict = {}
        date_dict['Start Date'] = start_date
        date_dict['end Date'] = end_date
        date_dict['Average Temperature'] = result[0]
        date_dict['Highest Temperature'] = result[1]
        date_dict['Lowest Temperature'] = result[2]
        date_list.append(date_dict)
    
    return jsonify(date_list)


if __name__ == '__main__':
    app.run(debug=True)


 
