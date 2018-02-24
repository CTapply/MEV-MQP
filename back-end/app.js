var express = require('express')
  , app = express()
  , port = 3001
const redis = require('redis')
const { Client } = require('pg')
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const os = require('os');
const fs = require('fs')

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

// Connect to the Database on Localhost
const db = new Client({
  host: 'localhost',
   database: 'faers',
   port: 5432,
 });

//Connect to the Database on WPI Server
// const db = new Client({
//   user: 'mevuser',
//   host: 'mev.wpi.edu',
//   database: 'faers',
//   password: 'mevmqp',
//   port: '5432'
// });

db.connect()
.catch(err => console.log(err))

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
function productBuilder(product) {
  let productString = ` AND `;
  
  if (product.length === 0) {
    return '';
  }

  if (product.length === 1) {
    return productString + `drugname = '${product}'`
  }
  
  if (product.length > 1) {
    const productMap = product.map(filter => {
      if (filter === 'UNK') {
        return `drugname IS NULL`;
      } else {
        return `drugname = '${filter}'`;
      }
    });
    return `${productString}(${productMap.join(' OR ')})`
  }
}

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
  console.log('got a report request with body:\n ', req.body);
  let query = '';
  if (req.body.bin === 'all reports') {
    query =
    'WITH bin_pids '
  + 'AS (SELECT get_pid_from_bin as pids '
  +     `FROM get_pid_from_bin(${req.body.userID}, 'trash')) `
  + 'SELECT * '
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
    
    query += ' AND primaryid::integer not in (select unnest(pids) from bin_pids)';
  } else {
    query = 
    'WITH bin_pids '
  + 'AS (SELECT get_pid_from_bin as pids '
  +     `FROM get_pid_from_bin(${req.body.userID}, '${req.body.bin}')) `
  + 'SELECT * '
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

    query += ' AND primaryid::integer in (select unnest(pids) from bin_pids)';
  }
  console.log(query)
  db.query(query, (err, data) => {
    res.status(200).send(data);
  });
});

app.post('/getreportsincases', (req, res) => {
  console.log('got a report in cases request with body:\n ', req.body);
  if (req.body.userID) {
    let query = 'SELECT DISTINCT primaryid, name '
    + 'FROM cases '
    + `WHERE user_id='${req.body.userID}'`;
    
    console.log(query)
    db.query(query, (err, data) => {
      res.status(200).send(data);
    });
  } else {
    res.status(200).send({ rows: [] });
  }
});

app.post('/getinactivecases', (req, res) => {
  if (req.body.userID) {
    let query = 'SELECT * '
    + 'FROM cases '
    + `WHERE user_id='${req.body.userID}' AND active='f' AND primaryid='-1'`;
    
    console.log(query);
    db.query(query, (err, data) => {
      res.status(200).send(data);
    });
  }
});

app.post('/getactivecases', (req, res) => {
  if (req.body.userID) {
    let query = 'SELECT * '
    + 'FROM cases '
    + `WHERE user_id='${req.body.userID}' AND active='t' AND primaryid='-1'`;
    
    console.log(query);
    db.query(query, (err, data) => {
      res.status(200).send(data);
    });
  } 
});

app.post('/binreport', (req, res) => {
  console.log('got a bin request to move report with body:\n', req.body);
  caseIDQuery = `SELECT DISTINCT case_id FROM cases WHERE name = '${req.body.toBin}' AND user_id = ${req.body.userID}`;
  console.log(caseIDQuery);
  db.query(caseIDQuery, (err, caseIDResult) => {
    let caseID;
    if(req.body.toBin !== 'all reports'){
      caseID = caseIDResult.rows[0].case_id;
    }
    toQuery = 'INSERT INTO cases (case_id, primaryid, name, user_id, type) '
    + `VALUES ('${caseID}', ${req.body.primaryid}, '${req.body.toBin}', ${req.body.userID}, '${req.body.type}') `
    + `ON CONFLICT (case_id, primaryid) DO UPDATE `
    + `SET type = '${req.body.type}' `
    + `WHERE cases.case_id = '${caseID}' AND cases.primaryid = ${req.body.primaryid} AND cases.name = '${req.body.toBin}' AND cases.user_id = ${req.body.userID}`;
    fromQuery = 'DELETE FROM cases '
    + `WHERE primaryid = ${req.body.primaryid} AND `
    + `user_id = ${req.body.userID} AND name = '${req.body.fromBin}'`;

    if (req.body.toBin === 'trash') {
      fromQuery = 'DELETE FROM cases '
      + `WHERE primaryid = ${req.body.primaryid} AND `
      + `user_id = ${req.body.userID} AND NOT name = '${req.body.toBin}'`;
    }

  if ((req.body.toBin === 'trash' || req.body.fromBin !== 'all reports') && req.body.toBin !== 'all reports') {
    console.log(toQuery, fromQuery);
    db.query(toQuery, (err, toData) => {
      db.query(fromQuery, (err, fromData) => {
        res.status(200).send();
      });
    });
  } else if (req.body.fromBin === 'all reports' && req.body.toBin !== 'all reports') {
    console.log(toQuery);
    db.query(toQuery, (err, toData) => {
        res.status(200).send();
    });
  } else if (req.body.fromBin !== 'all reports' && req.body.toBin === 'all reports') {
    console.log(fromQuery);
    db.query(fromQuery, (err, fromData) => {
        res.status(200).send();
    });
  }
});

app.post('/getuserbins', (req, res) => {
  console.log('got a request to get bins with body:\n', req.body);
  let query =
  'SELECT name ' 
+ 'FROM bins '
+ `WHERE user_id = ${req.body.userID}`;
  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send(data);
  });
})

app.post('/createuserbin', (req, res) => {
  console.log('got a request to create new bin with body:\n', req.body);
  let query =
  'INSERT INTO bins '
+ `VALUES (${req.body.userID}, '${req.body.binName}', null)`;
  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send();
  });
})

app.post('/getuserbins', (req, res) => {
  console.log('got a request to get bins with body:\n', req.body);
  let query =
  'SELECT name '
+ 'FROM bins '
+ `WHERE user_id = ${req.body.userID}`;
  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send(data);
  });
})

app.post('/createuserbin', (req, res) => {
  console.log('got a request to create new bin with body:\n', req.body);
  let query =
  'INSERT INTO bins '
+ `VALUES (${req.body.userID}, '${req.body.binName}', null)`;
  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send();
  });
})

app.post('/getusertrash', (req, res) => {
  console.log('got a user request with body:\n ', req.body)
  let query =
  'SELECT user_id '
+ 'FROM bins '
+ 'WHERE user_id = ' + req.body.userID;
  db.query(query, (err, data) => {
    res.status(200).send(data);
  });
});

app.post('/getuserread', (req, res) => {
  console.log('got a user request with body:\n ', req.body)
  let query =
  'SELECT user_id '
+ 'FROM cases '
+ 'WHERE user_id = ' + req.body.userID + ' '
+ `AND name = 'read'`;
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
  let query =
  'INSERT INTO users(email) VALUES (\''+ req.body.email +'\');';
  db.query(query, (err, data) => {
    res.status(200).send();
  });
});

app.put('/makeusertrash', (req, res) => {
  console.log('got a make trash request');
  let query =
  'INSERT INTO cases (name, user_id, primaryid) VALUES ( \'trash\',' + req.body.userID + ', -1)';
  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send();
  });
});

app.put('/makeuserread', (req, res) => {
  console.log('got a make read case request');
  let query =
  'INSERT INTO cases (name, user_id, primaryid) VALUES ( \'read\',' + req.body.userID + ', -1)';
  console.log(query);
  db.query(query, (err, data) => {
    res.status(200).send();
  });
});

app.put('/archivecase', (req, res) => {
  console.log('got an archive request');
  let query =
  'UPDATE cases '
+ `SET active = '${req.body.active}' `
+ `WHERE name = '${req.body.name}' AND user_id = '${req.body.userID}' AND primaryid = -1`
  console.log(query);
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
  
  let productQuery = "SELECT z.drugname as name, count(*)::INTEGER as size, "
  + `count(CASE WHEN outc_cod @> '{DE}' THEN 1 end)::INTEGER as "DE", `
  + `count(CASE WHEN outc_cod @> '{CA}' THEN 1 end)::INTEGER as "CA", `
  + `count(CASE WHEN outc_cod @> '{DS}' THEN 1 end)::INTEGER as "DS", `
  + `count(CASE WHEN outc_cod @> '{HO}' THEN 1 end)::INTEGER as "HO", `
  + `count(CASE WHEN outc_cod @> '{LT}' THEN 1 end)::INTEGER as "LT", `
  + `count(CASE WHEN outc_cod @> '{RI}' THEN 1 end)::INTEGER as "RI", `
  + `count(CASE WHEN outc_cod @> '{OT}' THEN 1 end)::INTEGER as "OT", `
  + `count(CASE WHEN NOT outc_cod && '{DE, CA, DS, HO, LT, RI, OT}' THEN 1 end)::INTEGER as "UNK" `
  + "FROM (SELECT b.drugname, a.outc_cod " 
    + "FROM (SELECT primaryid, init_fda_dt, outc_cod FROM demo_outcome " 
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
    console.log(productQuery)

  db.query(meTypeQuery, (err, meTypeData) => {
    db.query(productQuery, (err, productData) => {
      db.query(stageQuery, (err, stageData) => {
        db.query(causeQuery, (err, causeData) => {
          returnObject = { 
            meType: meTypeData.rows,
            product: productData.rows,
            stage: stageData.rows,
            cause: causeData.rows,
          }
          res.status(200).send(returnObject);
        })
      })
    })
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

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 2; i += 1) {
    rand += Math.random();
  }

  return rand / 2;
}

function gaussianRandom(start, end) {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}

function writeSQL(dataRows, drugReactions, meTypesArray, drugNamesArray, causesArray, stagesArray, adverseReactionsArray, fileNum) {
  const wstream = fs.createWriteStream(`./sqlfiles/output${fileNum}.txt`);
  return new Promise((resolve1, reject) => {
    let meTypeIndex, drugNameIndex, stageIndex, causeIndex, adverseReactionsIndex;
    let promises = [];
    dataRows.forEach((pidRow) => {
      // Get a random index in a normal distribution
      meTypeIndex = gaussianRandom(0, meTypesArray.length -1);
      causeIndex = gaussianRandom(0, causesArray.length -1);
      stageIndex = gaussianRandom(0, stagesArray.length -1);

      let updateDemoRowQuery = 
        `UPDATE demo SET `
          + `me_type='${meTypesArray[meTypeIndex]}', `
          + `stage='${stagesArray[stageIndex]}', `
          + `cause='${causesArray[causeIndex]}' `
        + `WHERE primaryid=${pidRow.primaryid};\n`;
      
      // console.log(updateDemoRowQuery);
      wstream.write(updateDemoRowQuery);
      
      const drugNamesforPID = [];
      // Generate 1-4 random drugs for this primary id
      const numberOfDrugsForPID = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numberOfDrugsForPID; i += 1) {
        drugNameIndex = gaussianRandom(0, drugNamesArray.length -1);
        drugNamesforPID.push(drugNameIndex);
      }

      // Update the Drugs for this PrimaryID
      let getDrugRowQuery = 
        `SELECT drug_seq FROM drug WHERE primaryid=${pidRow.primaryid}`;

      promises.push(new Promise((resolve2, reject) => {
        db.query(getDrugRowQuery, (err, drugData) => {
          drugData.rows.forEach((drugRow, rowIndex) => {
            const randomDrug = drugNamesArray[drugNamesforPID[rowIndex % numberOfDrugsForPID]];
            let updateDrugRowQuery;
            if (drugRow.drug_seq > numberOfDrugsForPID) {
              updateDrugRowQuery =
                `DELETE FROM drug WHERE primaryid=${pidRow.primaryid} AND drug_seq='${drugRow.drug_seq}';\n`;
              wstream.write(updateDrugRowQuery);
            } else if (rowIndex < numberOfDrugsForPID){
              updateDrugRowQuery =
                `UPDATE drug SET `
                  + `drugname='${randomDrug}' `
                + `WHERE primaryid=${pidRow.primaryid} `
                + `AND drug_seq='${drugRow.drug_seq}';\n`;

              wstream.write(updateDrugRowQuery);

              // Generate 1-5 random Reactions for this drug if we haven't already
              if (!drugReactions[randomDrug]) {
                drugReactions[randomDrug] = [];
                const numberOfReactionsForDrug = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < numberOfReactionsForDrug; i += 1) {
                  adverseReactionsIndex = gaussianRandom(0, adverseReactionsArray.length -1);
                  drugReactions[randomDrug].push(adverseReactionsIndex);
                }
              }

              // Update the Reactions for this drug and PrimaryID
              const deleteReactionsForThisPID =
                `DELETE FROM reac WHERE primaryid=${pidRow.primaryid};\n`;
              wstream.write(deleteReactionsForThisPID);

              let insertReaction = `INSERT INTO reac (primaryid, caseid, pt, drug_rec_act) VALUES `
              for (let i = 0; i < gaussianRandom(1, drugReactions[randomDrug].length); i += 1) {
                const randomAdverseReaction = adverseReactionsArray[drugReactions[randomDrug][i]];
                insertReaction += `(${pidRow.primaryid}, ${pidRow.primaryid.slice(0,7)}, '${randomAdverseReaction}', ''), `
              }
              insertReaction = insertReaction.slice(0, insertReaction.length - 2);
              insertReaction += `;\n`;

              wstream.write(insertReaction)
            }
          })
          resolve2('DONE ALL INSERT')
        })
      }))
    })
    Promise.all(promises).then(() => {
      console.log(`Done with Chunk`)
      wstream.end();
      resolve1('DONE ALL')
    })
  })
}

app.get('/update-data', (req, res) => {
  // fs.readFile("../Causes.txt", "utf8", function (error, causes) {
  //   fs.readFile("../Stages.txt", "utf8", function (error, stages) {
  //     fs.readFile("../MeTypes.txt", "utf8", function (error, meTypes) {
  //       fs.readFile("../DrugNames.txt", "utf8", function (error, drugNames) {
  //         fs.readFile("../AdverseReactions.txt", "utf8", function (error, adverseReactions) {
  //           const meTypesArray = meTypes.split('\n');
  //           const drugNamesArray = drugNames.split('\n');
  //           const causesArray = causes.split('\n');
  //           const stagesArray = stages.split('\n');
  //           const adverseReactionsArray = adverseReactions.split('\n');
  //           console.log('updating the meType, Stage and Cause columns')

  //           const drugReactions = {};

  //           let promiseChain = Promise.resolve();
  //           let promises = [];

  //           let query = `SELECT primaryid FROM demo`

  //           let dataChunk;
  //           const chunkSize = 100000;
  //           let dataChunkStart = 0;
  //           let dataChunkEnd = chunkSize;
            
  //           db.query(query, (err, allData) => {
  //             let i = 1;
  //             while ((dataChunk = allData.rows.slice(dataChunkStart, dataChunkEnd)).length !== 0) {
  //               console.log('Adding .then in while')
  //               const asd = dataChunk;
  //               const fileNum = i;
  //               promiseChain = promiseChain.then(() => {
  //                 return writeSQL(asd, drugReactions, meTypesArray, drugNamesArray, causesArray, stagesArray, adverseReactionsArray, fileNum);
  //               });
  //               i += 1;
  //               dataChunkStart += chunkSize;
  //               dataChunkEnd += chunkSize;
  //             }
  //             console.log('Adding last .then')
  //             promiseChain.then(() => {
  //               console.log('Done!')
  //               res.status(200).send('ok');
  //             })
  //           })
  //         });
  //       });
  //     });
  //   });
  // });
});

app.listen(port);
console.log('listening on ' + port)
