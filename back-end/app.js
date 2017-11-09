var express = require('express')
  , app = express()
  , port = 3001
const redis = require('redis')
const { Client } = require('pg')
const bodyParser = require('body-parser');
const os = require('os');

let cache = {
  get: () => Promise.resolve(null),
  send_command: (type, from, callback) => {
    if (callback != null) {
      callback('', null);
    } else {
      Promise.resolve(null);
    }
  },
  set: () => Promise.resolve(),
};

if (os.platform() === 'linux' || os.platform() === 'darwin') {
  console.log('on linux or mac, using local cache');
  cache = redis.createClient();  
}

if (os.platform() === 'win32') {
  console.log('on window, not using local cache');
}

const db = new Client({
  user: 'MEVUser',
  host: 'test-mevdb.ccrdelq8psso.us-east-1.rds.amazonaws.com',
  database: 'faers',
  password: '2UdS1KQo',
  port: '5432'
});

db.connect()

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('got a request')
  res.status(200).send({});
})

function sexBuilder(sex) {
  let sexString = ` AND `;
  
  if (sex.length === 0) {
    return '';
  }

  if (sex.length === 1) {
    console.log(sex)
    if (sex[0] === 'UNK') {
        return sexString + `(sex = '${sex}' OR sex IS NULL)`;
      } else {
        return sexString + `sex = '${sex}'`;
      }
  }
  
  if (sex.length > 1) {
    const sexMap = sex.map(filter => {
      if (filter === 'UNK') {
        return `sex = '${filter}' OR sex IS NULL`;
      } else {
        return `sex = '${filter}'`;
      }
    });
    return `${sexString}(${sexMap.join(' OR ')})`
  }
} 

function locationBuilder(location) {
  let locationString = ` AND `;
  
  if (location.length === 0) {
    return '';
  }

  if (location.length === 1) {
    return locationString + `occr_country = '${location}'`
  }
  
  if (location.length > 1) {
    const locationMap = location.map(filter => {
      if (filter === 'UNK') {
        return `occr_country IS NULL`;
      } else {
        return `occr_country = '${filter}'`;
      }
    });
    return `${locationString}(${locationMap.join(' OR ')})`
  }
} 

app.post('/getdata', (req, res) => {
  console.log('got a request with body:\n ', req.body)
  let query = 
  `SELECT sex, age, age_cod, occr_country, REPT_DT, occp_cod `
+ `FROM demo `
+ `WHERE (REPT_DT BETWEEN ${req.body.REPT_DT.start} AND ${req.body.REPT_DT.end})`;

  query += sexBuilder(req.body.sex);
  query += locationBuilder(req.body.occr_country);

  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send(data);
  })
});

app.post('/gettimelinedata', (req, res) => {
  console.log('got a request for timeline data')
  cache.send_command('JSON.GET', ['timeline'], (err, data) => {
    if (data !== null) {
      console.log('got timeline data from cache')
      return res.status(200).send(data)
    } else {
      console.log('Going to Database')
        let query = 
          "SELECT a.init_fda_dt, count(CASE WHEN a.outc_cod is not null then 1 end)::INTEGER as serious, count(CASE WHEN a.outc_cod is null then 1 end)::INTEGER as not_serious "
          + "FROM (SELECT d.init_fda_dt, o.outc_cod " 
          +       "FROM (SELECT primaryid, init_fda_dt "
          +             "FROM demo) d "
          +       "FULL OUTER JOIN (SELECT primaryid, outc_cod "
          +             "FROM outc) o "
          +       "ON d.primaryid = o.primaryid) a "
          + "GROUP BY a.init_fda_dt "
          + "ORDER BY a.init_fda_dt"
      db.query(query, (err, data) => {
        // console.log(data.rows)
        console.log('got timeline data from db');
        json = JSON.stringify(data.rows);
        cache.send_command("JSON.SET", ['timeline', '.', json]);
        res.status(200).send(data.rows);
      })
    }
  })
});

app.listen(port);
console.log('listening on ' + port)

