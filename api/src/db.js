const Pool = require('pg').Pool
const pool = new Pool({
  user: 'wxdvsxyk',
  host: 'rosie.db.elephantsql.com',
  database: 'wxdvsxyk',
  password: 'l2MVGmEDxfq0G7F4tOZfILEhrHxrha9N',
  port: 5432,
});

module.exports = pool;
