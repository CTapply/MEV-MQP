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
