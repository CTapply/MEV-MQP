# MEV-MQP

## Setup
### Dependencies
* NodeJS (download the most recent version for your OS at https://nodejs.org/en/download/)
* Postgres (download the most recent version for your OS at https://www.postgresql.org/download/)
* (OPTIONAL mac/linux only) Redis (download the most recent version for your OS at https://redis.io/download)
** Follow the instructions at (http://rejson.io/#building-and-loading-the-module) to set up the json module for redis 

### Database
1. Run the command ```createdb faers``` in your command line interface
2. Download our DB dump file from XXX called XXX.dump
3. Run the command ```psql faers < XXX.dump``` to import data into the database (this may take some time)

### Startup
1. Navigate to outermost folder in the repository on your computer
2. Run ```npm install```
3. Navigate to front-end folder
4. Run ```npm install```
5. Navigate to back-end folder
6. Run ```npm install```
7. (OPTIONAL mac/linux only) Navigate to your Redis folder and run ```redis-server --loadmodule /path/to/module/rejson.so```
8. Naviate to outermost folder
9. Run ```npm start``` to start the application

## Project Layout  
|-back-end  
|-front-end  
|---public  
|____src  
| |____resources  
| |____components  
| | |____visualization  
| | | |____components  
| | | | |____demographics  
| | | | | |____components  
| | | | | | |____components  
| | | | |____timeline  
| | | | | |____components  
| | | | | | |____components  
| | | | |____treeMap  
| | | | | |____components  
| | |____portal  
| | | |____images  
| | | |____userComponents  
| | |____cases  
| | |____components  
| | |____editor  
| | | |____images  
| | |____reports  
| | | |____components  
| |____actions  
| |____reducers  

## Working on the Front End
To make changes to the UI and other aspects of the front end, you must edit assets found in the front-end folder.

### Working on the Visualization page
Assets for the visualization page exist within the visualization folder src/components/visualization.  
visualization/App.js uses the components for the treemaps, demographics, and timeline which assets are each in their respective folder inside visualization/components.

### Working on the Reports Listing page
Assets for the reports listing page exist within the reports folder src/components/reports.  
reports/ReportsList.jsx uses the components for the report listing grid which assets are all contained in teh folder reports/components.

### Working on the Narrative Editor page
All assets for the narrative editor page exist within the editor folder src/components/editor   

### Working on the Login page, About page, or Dashboard page
All assets for these pages exist within the portal folder src/components/portal   
Assets for the dashboard page exist inside the portal/userComponents folder.

## Working on the Back End
Our backend is a one file server that recieves requests sent from the front end located at back-end/App.js

### Adding and modifying endpoints
We use the express library (https://expressjs.com/) for our backend and documentation for use can be found at https://expressjs.com/en/4x/api.html#app.
