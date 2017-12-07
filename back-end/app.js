var express = require('express')
  , app = express()
  , port = 3001
const redis = require('redis')
const { Client } = require('pg')
const bodyParser = require('body-parser');
const os = require('os');

// Initialze a dummy cache for systems that can't run REDIS
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

// Connect to the REDIS cache if we are on MacOS or Liux
if (os.platform() === 'linux' || os.platform() === 'darwin') {
  console.log('on linux or mac, using local cache');
  cache = redis.createClient();  
}

// We cannot use REDIS if on Windows
if (os.platform() === 'win32') {
  console.log('on window, not using local cache');
}

// Connect to the Database on AWS
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

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Sex Filtering
 * @param {Array} sex List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Sex filters
 */
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

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Location Filtering
 * @param {Array} location List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Location filters
 */
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

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Location Filtering
 * @param {Array} occupation List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Location filters
 */
function occupationBuilder(occupation) {
  let occupationString = ` AND `;
  
  if (occupation.length === 0 || occupation.length === 6) {
    return '';
  }

  if (occupation.length === 1) {
    if (occupation[0] === 'UNK') {
      return occupationString + `(occp_cod = '${occupation}' OR occp_cod IS NULL)`;
    } else {
      return occupationString + `occp_cod = '${occupation}'`;
    }
  }
  
  if (occupation.length > 1) {
    const occupationMap = occupation.map(filter => {
      if (filter === 'UNK') {
        return `occp_cod IS NULL`;
      } else {
        return `occp_cod = '${filter}'`;
      }
    });
    return `${occupationString}(${occupationMap.join(' OR ')})`
  }
}

/**
 * Parses a range of dates into the low and high end
 * @param {String} filter this is a range of years to filter for
 * @return {Object} containing the lowEnd and highEnd of the age Range
 */
function getAgeRange(filter) {
  if (filter === '99+') return { lowEnd: 99, highEnd: 1000000 };
  const splitAge = filter.split('-');
  const lowEnd = splitAge[0];
  const highEnd = splitAge[1];
  return { lowEnd, highEnd };
}

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Age Filtering
 * @param {Array} age List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Age filters
 */
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

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for ME-Type Filtering
 * @param {Array} meType List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for ME-Type filters
 */
function meTypeBuilder(meType) {
  let meTypeString = ` AND `;
  
  if (meType.length === 0) {
    return '';
  }

  if (meType.length === 1) {
    return meTypeString + `me_type = '${meType}'`
  }
  
  if (meType.length > 1) {
    const meTypeMap = meType.map(filter => {
      if (filter === 'UNK') {
        return `me_type IS NULL`;
      } else {
        return `me_type = '${filter}'`;
      }
    });
    return `${meTypeString}(${meTypeMap.join(' OR ')})`
  }
}
/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Product Filtering
 * @param {Array} product List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Product filters
 */
// function productBuilder(product) {
//   let productString = ` AND `;
  
//   if (product.length === 0) {
//     return '';
//   }

//   if (product.length === 1) {
//     return productString + `product = '${product}'`
//   }
  
//   if (product.length > 1) {
//     const productMap = product.map(filter => {
//       if (filter === 'UNK') {
//         return `product IS NULL`;
//       } else {
//         return `product = '${filter}'`;
//       }
//     });
//     return `${productString}(${productMap.join(' OR ')})`
//   }
// }

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Stage Filtering
 * @param {Array} stage List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Stage filters
 */
function stageBuilder(stage) {
  let stageString = ` AND `;
  
  if (stage.length === 0) {
    return '';
  }

  if (stage.length === 1) {
    return stageString + `stage = '${stage}'`
  }
  
  if (stage.length > 1) {
    const stageMap = stage.map(filter => {
      if (filter === 'UNK') {
        return `stage IS NULL`;
      } else {
        return `stage = '${filter}'`;
      }
    });
    return `${stageString}(${stageMap.join(' OR ')})`
  }
}

/**
 * Creates the string of a SQL WHERE statement (Starts with AND) for Cause Filtering
 * @param {Array} cause List of things to filter for
 * @return {String} AND statement used for SQL query to add filtering for Cause filters
 */
function causeBuilder(cause) {
  let causeString = ` AND `;
  
  if (cause.length === 0) {
    return '';
  }

  if (cause.length === 1) {
    return causeString + `cause = '${cause}'`
  }
  
  if (cause.length > 1) {
    const causeMap = cause.map(filter => {
      if (filter === 'UNK') {
        return `cause IS NULL`;
      } else {
        return `cause = '${filter}'`;
      }
    });
    return `${causeString}(${causeMap.join(' OR ')})`
  }
}

/**
 * Endpoint that takes in some body with filters to query the database and return the data for the demographic visualization
 */
app.post('/getdemographicdata', (req, res) => {
  console.log('got a request with body:\n ', req.body)
  let query = 
  `SELECT sex, age_year as age, occr_country, init_fda_dt, occp_cod, outc_cod `
+ `FROM demo_outcome `
+ `WHERE (init_fda_dt BETWEEN ${req.body.init_fda_dt.start} AND ${req.body.init_fda_dt.end})`;

  query += sexBuilder(req.body.sex);
  query += locationBuilder(req.body.occr_country);
  query += ageBuilder(req.body.age);
  query += occupationBuilder(req.body.occp_cod);
  query += meTypeBuilder(req.body.meType);
  // query += productBuilder(req.body.product);
  query += stageBuilder(req.body.stage);
  query += causeBuilder(req.body.cause);

  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send(data);
  })
});

app.post('/getreports', (req, res) => {
  console.log('got a report request with body:\n ', req.body)
  let query =
  'SELECT * '
+ 'FROM reports '
+ `WHERE (init_fda_dt BETWEEN ${req.body.init_fda_dt.start} AND ${req.body.init_fda_dt.end})`;

  query += sexBuilder(req.body.sex);
  query += locationBuilder(req.body.occr_country);
  query += ageBuilder(req.body.age);
  query += occupationBuilder(req.body.occp_cod);
  query += meTypeBuilder(req.body.meType);
  // query += productBuilder(req.body.product);
  query += stageBuilder(req.body.stage);
  query += causeBuilder(req.body.cause);
  console.log(query)
  db.query(query, (err, data) => {
    res.status(200).send(data);
  });
});

app.post('/getreporttext', (req, res) => {
  console.log('got a report text request with body:\n ', req.body)
  let query =
  'SELECT report_text, tags '
+ 'FROM demo '
+ 'WHERE primaryid = ' + req.body.primaryid;
  db.query(query, (err, data) => {
    res.status(200).send(data);
  });
});

app.post('/getuser', (req, res) => {
  console.log('looking for user with request body: \n', req.body);
  let query =
  'SELECT user_id, email '
+ 'FROM users '
+ 'WHERE email=\'' + req.body.email + '\'';
console.log('user quer: \n', query);
  db.query(query, (err, data) => {
    //console.log(data);
    res.status(200).send(data);
  });
});

app.put('/saveuser', (req, res) => {
  console.log('got a save report text request');
  let query =
  'INSERT INTO users(email) VALUES (\''+ req.body.email +'\');'
  db.query(query, (err, data) => {
    res.status(200).send();
  });
});

app.put('/savereporttext', (req, res) => {
  console.log('got a save report text request');
  tags = JSON.stringify(req.body.tags) === '{}' ? 'null' : '\'' + JSON.stringify(req.body.tags) + '\'';
  let query =
  'UPDATE demo '
+ 'SET report_text = $$' + req.body.text + '$$, tags = (' + tags + ') '
+ 'WHERE primaryid = ' + req.body.primaryid;
  db.query(query, (err, data) => {
    res.status(200).send();
  });
});

/**
 * Endpoint that takes in some body with filters to query the database and return the data for the main visualization
 */
app.post('/getvis', (req, res) => {
  console.log('got a request with body:\n ', req.body)
  let returnObject = {};
  let meTypeQuery = `SELECT me_type as name, count(*)::INTEGER as size, `
    + `count(CASE WHEN outc_cod @> '{DE}' THEN 1 end)::INTEGER as "DE", `
    + `count(CASE WHEN outc_cod @> '{CA}' THEN 1 end)::INTEGER as "CA", `
    + `count(CASE WHEN outc_cod @> '{DS}' THEN 1 end)::INTEGER as "DS", `
    + `count(CASE WHEN outc_cod @> '{HO}' THEN 1 end)::INTEGER as "HO", `
    + `count(CASE WHEN outc_cod @> '{LT}' THEN 1 end)::INTEGER as "LT", `
    + `count(CASE WHEN outc_cod @> '{RI}' THEN 1 end)::INTEGER as "RI", `
    + `count(CASE WHEN outc_cod @> '{OT}' THEN 1 end)::INTEGER as "OT", `
    + `count(CASE WHEN NOT outc_cod && '{DE, CA, DS, HO, LT, RI, OT}' THEN 1 end)::INTEGER as "UNK" `
  + `FROM demo_outcome `
  + "WHERE init_fda_dt BETWEEN " + req.body.init_fda_dt.start + " AND " + req.body.init_fda_dt.end
  meTypeQuery += sexBuilder(req.body.sex);
  meTypeQuery += locationBuilder(req.body.occr_country);
  meTypeQuery += ageBuilder(req.body.age);
  meTypeQuery += occupationBuilder(req.body.occp_cod);
  meTypeQuery += meTypeBuilder(req.body.meType);
  // meTypeQuery += productBuilder(req.body.product);
  meTypeQuery += stageBuilder(req.body.stage);
  meTypeQuery += causeBuilder(req.body.cause);
  meTypeQuery += " GROUP BY me_type";

  console.log(meTypeQuery)

  let stageQuery = `SELECT stage as name, count(*)::INTEGER as size, `
  + `count(CASE WHEN outc_cod @> '{DE}' THEN 1 end)::INTEGER as "DE", `
  + `count(CASE WHEN outc_cod @> '{CA}' THEN 1 end)::INTEGER as "CA", `
  + `count(CASE WHEN outc_cod @> '{DS}' THEN 1 end)::INTEGER as "DS", `
  + `count(CASE WHEN outc_cod @> '{HO}' THEN 1 end)::INTEGER as "HO", `
  + `count(CASE WHEN outc_cod @> '{LT}' THEN 1 end)::INTEGER as "LT", `
  + `count(CASE WHEN outc_cod @> '{RI}' THEN 1 end)::INTEGER as "RI", `
  + `count(CASE WHEN outc_cod @> '{OT}' THEN 1 end)::INTEGER as "OT", `
  + `count(CASE WHEN NOT outc_cod && '{DE, CA, DS, HO, LT, RI, OT}' THEN 1 end)::INTEGER as "UNK" `
+ `FROM demo_outcome `
  + "WHERE init_fda_dt BETWEEN " + req.body.init_fda_dt.start + " AND " + req.body.init_fda_dt.end
  stageQuery += sexBuilder(req.body.sex);
  stageQuery += locationBuilder(req.body.occr_country);
  stageQuery += ageBuilder(req.body.age);
  stageQuery += occupationBuilder(req.body.occp_cod);
  stageQuery += meTypeBuilder(req.body.meType);
  // stageQuery += productBuilder(req.body.product);
  stageQuery += stageBuilder(req.body.stage);
  stageQuery += causeBuilder(req.body.cause);
  stageQuery += " GROUP BY stage"; 

  let causeQuery = `SELECT cause as name, count(*)::INTEGER as size, `
  + `count(CASE WHEN outc_cod @> '{DE}' THEN 1 end)::INTEGER as "DE", `
  + `count(CASE WHEN outc_cod @> '{CA}' THEN 1 end)::INTEGER as "CA", `
  + `count(CASE WHEN outc_cod @> '{DS}' THEN 1 end)::INTEGER as "DS", `
  + `count(CASE WHEN outc_cod @> '{HO}' THEN 1 end)::INTEGER as "HO", `
  + `count(CASE WHEN outc_cod @> '{LT}' THEN 1 end)::INTEGER as "LT", `
  + `count(CASE WHEN outc_cod @> '{RI}' THEN 1 end)::INTEGER as "RI", `
  + `count(CASE WHEN outc_cod @> '{OT}' THEN 1 end)::INTEGER as "OT", `
  + `count(CASE WHEN NOT outc_cod && '{DE, CA, DS, HO, LT, RI, OT}' THEN 1 end)::INTEGER as "UNK" `
+ `FROM demo_outcome `
  + "WHERE init_fda_dt BETWEEN " + req.body.init_fda_dt.start + " AND " + req.body.init_fda_dt.end
  causeQuery += sexBuilder(req.body.sex);
  causeQuery += locationBuilder(req.body.occr_country);
  causeQuery += ageBuilder(req.body.age);
  causeQuery += occupationBuilder(req.body.occp_cod);
  causeQuery += meTypeBuilder(req.body.meType);
  // causeQuery += productBuilder(req.body.product);
  causeQuery += stageBuilder(req.body.stage);
  causeQuery += causeBuilder(req.body.cause);
  causeQuery += " GROUP BY cause";
  
  let productQuery = "SELECT z.drugname as name, count(*)::integer as size "
  + "FROM (SELECT b.drugname " 
    + "FROM (SELECT primaryid, init_fda_dt FROM demo " 
      + "WHERE init_fda_dt BETWEEN " + req.body.init_fda_dt.start + " AND " + req.body.init_fda_dt.end
      productQuery += sexBuilder(req.body.sex);
      productQuery += locationBuilder(req.body.occr_country);
      productQuery += ageBuilder(req.body.age);
      productQuery += occupationBuilder(req.body.occp_cod);
      productQuery += meTypeBuilder(req.body.meType);
      // productQuery += productBuilder(req.body.product);
      productQuery += stageBuilder(req.body.stage);
      productQuery += causeBuilder(req.body.cause);
      productQuery += ") a "
    + "INNER JOIN (SELECT primaryid::integer as id, drugname FROM drug) b ON a.primaryid = b.id) z "
    + "GROUP BY z.drugname"; 

  db.query(meTypeQuery, (err, meTypeData) => {
    //db.query(productQuery, (err, productData) => {
      db.query(stageQuery, (err, stageData) => {
        db.query(causeQuery, (err, causeData) => {
          returnObject = { 
            meType: meTypeData.rows,
            product: [],
            stage: stageData.rows,
            cause: causeData.rows,
          }
          // console.log(returnObject);
          res.status(200).send(returnObject);
        })
      })
    //})
  })
});

/**
 * Endpoint that takes in some body with a date range to query the database and return the data for the timeline visualization
 */
app.post('/gettimelinedata', (req, res) => {
  console.log('got a request for timeline data')
  cache.send_command('JSON.GET', ['timeline'], (err, data) => {
    if (data !== null) {
      console.log('got timeline data from cache')
      return res.status(200).send(data)
    } else {
      console.log('Going to Database')
        let query = 
          "SELECT init_fda_dt, "
          + "count(CASE WHEN outc_cod && '{DE, CA, DS, HO, LT, RI, OT}' then 1 end)::INTEGER as serious, "
          + "count(CASE WHEN NOT outc_cod && '{DE, CA, DS, HO, LT, RI, OT}' then 1 end)::INTEGER as not_serious "
          + "FROM demo_outcome "
          + "GROUP BY init_fda_dt "
          + "ORDER BY init_fda_dt"
        console.log(query)
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

