covid-data-visualization
======
University of Denver: Data Analytics  |  Project 3

![alt-text](https://github.com/andrewjmack/covid-data-visualization/blob/main/resources/png/dashboard_NE.png "Example of Dashboard with State Selection Made")

Project Overview & Purpose
------
This repository houses content assembled to complete the project three "data visualization" track.

The purpose of this project is to allow for a better understanding of the impact that the COVID-19 epidemic had in the United States by providing visibility to measures such as infection, vaccination and recovery rates in each state through maps, tables and charts.

A dashboard transforms publicly available data (that is otherwise difficult to access or make sense of) into these visuals with which the public and U.S. health officials can interact. We believe there is a great public interest and benefit in access to this information, specifically as it pertains to the relationship between vaccination rates, population density and health outcomes in each state during the pandemic.

In addition to the dashboard, API endpoints are provided to allow for ease of access to clean U.S. source data on this topic to aid in the democratization of data. These endpoints are served via SQLite database, Flask app and SQLAlchemy for object relational mapping.

Repo Contents
------
The repository contents must be downloaded in order to run locally, with additional requirements detailed below.

   - **Covid_cleaning.ipynb** (Jupyter Notebook) contains the extraction and cleaning of the source data
   - **resources** contains the resulting CSV files
   - **app** contains the SQLite database (which schema and tables rely on the resources CSV files for load) and the API application to access the clean data
   - **static** contains the JavaScript and CSS files for the dashboard
   - **index.html** launches the dashboard for visualization and user interaction

Prerequisites for Use
------
There are several prerequisites for accessing and utilizing the various stages of extraction, transformation, loading ("ETL") and visualization, the chief among them being Python. The following are available for installation via Python Package Index; refer to source documentation for further details:

   - **Jupyter Notebook:**
      - install: `pip install notebook`
      - run: `jupyter notebook`

   - **SQLAlchemy:**
      - install: `pip install SQLAlchemy`

   - **Pandas:**
      - install: `pip install pandas`

   - **Flask:**
      - install: `pip install Flask`
      - for Cross-Origin Resource Sharing error: `pip install Flask-Cors`

The SQLite database can also be recreated by following the schema.SQL instructions.

Instructions for Use
------
1. From the command line interface ("CLI"), navigate to the app folder and launch the app: `python app.py`

2. With the app running in the background, copy/paste the resulting Flask server URL into a browser address bar to access the API endpoints:
`http://127.0.0.1:5000`

![alt-text](https://github.com/andrewjmack/covid-data-visualization/blob/main/resources/png/api_landing_page.png "API landing page with endpoint routes")

3. In a browser, access the dashboard by launching the index.html file:
   - Clicking on a state in the choropleth will load its table and chart data
   - Three charts are available via drop menu which are all plotted along with the cumulative person vaccinated:
      - number of people tested
      - number of COVID-19 deaths
      - recovery count
   - Choosing a date within the allowable range will update the table and chart

![alt-text](https://github.com/andrewjmack/covid-data-visualization/blob/main/resources/png/interaction.png "Available user interactions with dashboard")

**NOTE: The Flask application app.py MUST be running in the background in order for the dashboard to reach the API data for initial rendering and user interaction.**

Ethical Considerations
------
Our initial considerations when working with healthcare related data were legal privacy vs. the potential limiting nature of anonymity (and usefulness of a dataset) and the possibility for bias by protected class (gender, race, et al).

In the source data we chose to clean and then ultimately display, there were no biases introduced for data points such as age, sex or comorbidities (i.e., preexisting health conditions). Source data was also nnot available at a personal level, so the legal privacy protections in the storage and transfer of personal medical records as regulated by HIPAA was not a concern we would have to navigate.

Further ethical questions [1] that we considered as a team pertained to a broader ongoing discussion in the healthcare, technology and data communities on the ethics of data collection by private entities through technology such as personal devices (e.g., smart phones):
- Where does the benefit of private, digital medical information collection during an event such as a global epidemic end and invasion of personal privacy begin?
- What are the safeguards to protecting this data in the present and in a post-pandemic future?
- How will this data be used in the future when public opinion and perception has changed after the global COVID-19 crisis?

References
------
[1]: "In the shadow of privacy: Overlooked ethical concerns in COVID-19 digital epidemiology": https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9635223/

Broad data source of original reference:
- COVID-19 Open Data: https://health.google.com/covid-19/open-data/raw-data

Subset of data sources directly utilized for project:
- Epidemiology: https://github.com/GoogleCloudPlatform/covid-19-open-data/blob/main/docs/table-epidemiology.md  
- Vaccination: https://github.com/GoogleCloudPlatform/covid-19-open-data/blob/main/docs/table-vaccinations.md 
- Demographics: https://github.com/GoogleCloudPlatform/covid-19-open-data/blob/main/docs/table-demographics.md

Code references:
- Background styling reference for endpoints page:
https://getbootstrap.com/docs/5.3/utilities/background/#how-it-works
- Dropdown Events & Plotly:
https://jonathan-moo.github.io/ASU-VIRT-DATA-PT-03-2023-U-LOLC/14.3/index.html
- EdX and University of Denver course activities and notes


<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=header" />
