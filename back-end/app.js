var express = require('express')
  , app = express()
  , port = 3001
const { Client } = require('pg')
const bodyParser = require('body-parser');

const client = new Client({
  user: 'MEVUser',
  host: 'mevdb.ccrdelq8psso.us-east-1.rds.amazonaws.com',
  database: 'faers',
  password: '2UdS1KQo',
  port: '5432'
});

client.connect()


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

app.post('/getdata', (req, res) => {
  console.log('got a request with body:\n ', req.body)
  let query = 
  "SELECT sex, age, age_cod, occr_country, REPT_DT, occp_cod "
+ "FROM demo "
+ "WHERE REPT_DT BETWEEN " + req.body.startDate + " AND " + req.body.endDate;
  console.log(query);
  client.query(query, (err, data) => {
    res.status(200).send(data);
  })
});

app.post('/gettimelinedata', (req, res) => {
  console.log('got a request for timeline data')
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
  client.query(query, (err, data) => {
    res.status(200).send(data.rows);
  })
});

app.listen(port);
console.log('listening on ' + port)

