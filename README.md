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

### Data Visualization Track

 For this track, your group will tell a story using data visualizations. Here are the specific requirements:
  1. Your project must include visualizations. The visualizations can be created with:
     -  Python (e.g. Matplotlib, Pandas plotting, hvplot)
     -  JavaScript (e.g. Plotly or Leaflet)
     -  A Python or JavaScript visualization library that was not covered in class
    
  2. Data must be stored in and extracted from at least one database (PostgreSQL, MongoDB, SQLite, etc).
  3. Your project must include at least one JavaScript OR Python library that we did not cover.
  4. Your project must be powered by a dataset with at least 100 records.
  5. Your project must include some level of user-driven interaction, such as:
     - HTML menus, dropdowns, and/or textboxes to display JavaScript-powered visualizations
     - Flask backend with interactive API routes that serve back Python or JavaScript created plots
     - Visualizations created from user-selected filtered data, which could be powered by:
       -  JavaScript libraries
       -  Python in Jupyter Notebook
       -  Command-line Python scripts that save visualizations locally

        <t>$\bf{Remember\ 1}$</t>: You have learned how to filter data in Pandas, JavaScript, SQL, SQLAlchemy, and MongoDB.
  6. If possible, your final visualization should ideally include at least three views.
  7. Your GitHub repo must include a README.md with an outline of the project including:
     - An overview of the project and its purpose
     - Instructions on how to use and interact with the project
     - At least one paragraph summarizing efforts for ethical considerations made in the project
     - References for the data source(s)
     - References for any code used that is not your own

### Data Engineering Track

 For this track, your group will follow data engineering processes. Here are the specific requirements:
   1. Data must be stored in a SQL or NoSQL database (PostgreSQL, MongoDB, SQLite, etc) and the database must include at least two tables (SQL) or collections (NoSQL).
   2. The database must contain at least 100 records.
   3. Your project must use ETL workflows to ingest data into the database (i.e. the data should not be exactly the same as the original source; it should have been transformed in some way).
   4. Your project must include a method for reading data from the database and displaying it for future use, such as:
      - Pandas DataFrame
      - Flask API with JSON output
   5. Your project must use one additional library not covered in class related to data engineering. Consider libraries for data streaming, cloud, data pipelines, or data validation.
   6. Your GitHub repo must include a README.md with an outline of the project including:
      - An overview of the project and its purpose
      - Instructions on how to use and interact with the project
      - Documentation of the database used and why (e.g. benefits of SQL or NoSQL for this project)
      - ETL workflow with diagrams or ERD
      - At least one paragraph summarizing efforts for ethical considerations made in the project
      - References for the data source(s)
      - References for any code used that is not your own
   7. OPTIONAL: add user-driven interaction, either before or after the ETL process. e.g.:
      - BEFORE: provide a menu of options for the user to narrow the range of data being extracted from a data source (e.g. API or CSV file, where fields are known in advance).
      - AFTER: Once the data is stored in the database, add user capability to extract filtered data from the database prior to loading it in a Pandas DataFrame or a JSON output from a Flask API.

For this project, you can focus your efforts within a specific industry, as detailed in the following examples.

### Finance

  Tracking market data is crucial for equity traders. Not all traders code and are able to create custom-tailored visualizations. What’s the best way for them to get what they need for success?

 One option is offered by the Wall Street JournalLinks to an external site.. Their website offers a dashboarding tool providing a high-level view of market performance.

 This highly interactive tool allows users to easily explore stocks, bonds, currencies, and commodities.
   - Users of all skill levels can use the data.
   - Visualizations help make the data easier to understand.
   - Multiple views are available for customized content.

### Healthcare

 Imagine: Vacation time is coming up, and so is flu season. Trying to plan a road trip across the United States while keeping everyone’s health in mind can be tricky.

 Using the FluView dashboard provided by the CDC, users can easily confirm which areas to avoid.

 Different interactive features include:
   - An overall view of the United States, or customizable view (state by state)
   - Historic and current cases
   - A chart showing the count of cases, broken down by strain

 With this, data are delivered quickly and navigated through with ease.

### Custom

 We’ve only specified healthcare and finance, but any industry can benefit from data visualization. Consider the following example of weather tracking.

 While on the way to work one morning, you notice dark clouds on the horizon. You don’t remember hearing about a storm coming in, but this looks ominous.

 A quick visit to Weather Underground’s Dashboard helps illuminate the situation.

 Updated with live data, you can view a live map as well as specific conditions such as temperature, pressure, and even feed from a live webcam.

 The data delivery is up-to-date and seamless, making it easy to understand current conditions without digging too deeply.

### Working with Your Group

 When working on an online group project, it’s crucial to meet with your group and communicate regularly. Plan for significant collaboration time outside of class. The following tips can help you make the most of your time:
   - Decide how you’re going to communicate with your group members when you begin. Create a Slack channel, exchange phone numbers, and ensure that the group knows each group member’s available working hours.
   - Set up an agile project by using GitHub ProjectsLinks to an external site. so that your group can track tasks.
   - Create internal milestones to ensure that your group is on track. Set due dates for these milestones so that you have a timeline for completing the project. Some of these milestones might include:
      - Project ideation
      - Data fetching/API integration
      - Data analysis
      - Testing
      - Creating documentation 
      - Creating the presentation

 Since this is a two-week project, make sure that you have done at least half of your project by the end of the first week in order to stay on track.

 Although you will divide the work among the group members, it’s essential to collaborate and communicate while working on different parts of the project. Be sure to check in with your teammates regularly and offer support.

### Support and Resources

Your instructional team will provide support during classes and office hours. You will also have access to learning assistants and tutors to help you with topics as needed. Make sure to take advantage of these resources as you collaborate with your group on this first project.

<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=footer" />
