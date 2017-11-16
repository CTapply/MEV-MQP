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
  
  if (sex.length === 0 || sex.length === 3) {
    return '';
  }

  if (sex.length === 1) {
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

function getAgeRange(filter) {
  if (filter === '99+') return { lowEnd: 99, highEnd: 1000000 };
  const splitAge = filter.split('-');
  const lowEnd = splitAge[0];
  const highEnd = splitAge[1];
  return { lowEnd, highEnd };
}

function ageBuilder(age) {
  let ageString = ` AND `;
  
  if (age.length === 0 || age.length === 13) {
    return '';
  }

  if (age.length === 1) {
    if (age[0] === 'UNK') {
      return ageString + `age_year IS NULL`;
    } else {
      const { lowEnd, highEnd } = getAgeRange(age[0])
      return ageString + `age_year BETWEEN ${lowEnd} AND ${highEnd}`
    }
  }
  
  if (age.length > 1) {
    const ageMap = age.map(filter => {
      if (filter === 'UNK') {
        return `age_year IS NULL`;
      } else {
        const { lowEnd, highEnd } = getAgeRange(filter)
        return `age_year BETWEEN ${lowEnd} AND ${highEnd}`;
      }
    });
    return `${ageString}(${ageMap.join(' OR ')})`
  }
} 

app.post('/getdata', (req, res) => {
  console.log('got a request with body:\n ', req.body)
  let query = 
  `SELECT sex, age_year as age, occr_country, REPT_DT, occp_cod, outc_cod `
+ `FROM demo_outcome `
+ `WHERE (REPT_DT BETWEEN ${req.body.REPT_DT.start} AND ${req.body.REPT_DT.end})`;

  query += sexBuilder(req.body.sex);
  query += locationBuilder(req.body.occr_country);
  query += ageBuilder(req.body.age);

  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send(data);
  })
});

app.post('/getvis', (req, res) => {
  console.log('got a request with body:\n ', req.body)
  let returnObject = {};
  let meTypeQuery = "SELECT me_type as name, count(*)::INTEGER as size FROM demo "
  + "WHERE REPT_DT BETWEEN " + req.body.REPT_DT.start + " AND " + req.body.REPT_DT.end
  meTypeQuery += sexBuilder(req.body.sex);
  meTypeQuery += locationBuilder(req.body.occr_country);
  meTypeQuery += ageBuilder(req.body.age);
  meTypeQuery += " GROUP BY me_type";

  console.log(meTypeQuery)

  let stageQuery = "SELECT stage as name, count(*)::INTEGER as size FROM demo "
  + "WHERE REPT_DT BETWEEN " + req.body.REPT_DT.start + " AND " + req.body.REPT_DT.end
  stageQuery += sexBuilder(req.body.sex);
  stageQuery += locationBuilder(req.body.occr_country);
  stageQuery += ageBuilder(req.body.age);
  stageQuery += " GROUP BY stage"; 

  let productQuery = "SELECT z.drugname as name, count(*)::integer as size "
  + "FROM (SELECT b.drugname " 
      + "FROM (SELECT primaryid, REPT_DT FROM demo " 
        + "WHERE REPT_DT between " + req.body.REPT_DT.start + " AND " + req.body.REPT_DT.end
        productQuery += sexBuilder(req.body.sex);
        productQuery += locationBuilder(req.body.occr_country);
        productQuery += ageBuilder(req.body.age);
        productQuery += ") a "
      + "INNER JOIN (SELECT primaryid::integer as id, drugname FROM drug) b ON a.primaryid = b.id) z "
      + "GROUP BY z.drugname"; 

  let causeQuery = "SELECT cause as name, count(*)::INTEGER as size FROM demo "
  + "WHERE REPT_DT BETWEEN " + req.body.REPT_DT.start + " AND " + req.body.REPT_DT.end
  causeQuery += sexBuilder(req.body.sex);
  causeQuery += locationBuilder(req.body.occr_country);
  causeQuery += ageBuilder(req.body.age);
  causeQuery += " GROUP BY cause";

  db.query(meTypeQuery, (err, meTypeData) => {
    console.log(err)
    //db.query(productQuery, (err, productData) => {
      db.query(stageQuery, (err, stageData) => {
        db.query(causeQuery, (err, causeData) => {
          returnObject = { 
            meType: meTypeData.rows,
            product: [],
            stage: stageData.rows,
            cause: causeData.rows,
          }
          console.log(returnObject);
          res.status(200).send(returnObject);
        })
      })
    //})
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

