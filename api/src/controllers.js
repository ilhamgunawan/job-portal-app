const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { returnLoginFailed, returnGetJobFailed } = require('./utils');
const baseURL = 'http://dev3.dansmultipro.co.id/api/recruitment/positions';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const result = await pool.query(`
        SELECT u.username, u.password
        FROM users u
        WHERE u.username = '${username}'
      `);
      const user = result.rows[0];
      if (user) {
        const isPasswordMatch = bcrypt.compareSync(password, user.password);
        const token = jwt.sign(user, 'secret', { expiresIn: '7d' });
        if (isPasswordMatch) {
          return res.status(200)
            .cookie('token', token, { httpOnly: true, path: '/' })
            .send({
              status: 'Success',
              data: { user, token },
              message: '',
            });
        }
        return returnLoginFailed(res);
      }
      return returnLoginFailed(res);
    }
    return returnLoginFailed(res);
  } catch(e) {
    return returnLoginFailed(res);
  }
};

const getJobList = async (req, res) => {
  try {
    const query = req.query;
    const search = new URLSearchParams();
  
    if (query.description) search.append('description', query.description);
    if (query.location) search.append('location', query.location);
    if (query.full_time) search.append('full_time', query.full_time);
    if (query.page) search.append('page', query.page);

    const endpoint = `${baseURL}.json?${search.toString()}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data) {
      if (data.status === 500) {
        return returnGetJobFailed(res);
      }
      return res.status(200).send({
        status: 'Success',
        data,
        message: '',
      });
    }
    return returnGetJobFailed(res);
  } catch(e) {
    return returnGetJobFailed(res);
  }
};

const getJobDetail = async (req, res) => {
  try {
    const params = req.params;
    if (params.id) {
      const endpoint = `${baseURL}/${params.id}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.id) {
        return res.status(200).send({
          status: 'Success',
          data,
          message: '',
        });
      }
      return returnGetJobFailed(res);
    }
    return returnGetJobFailed(res);
  } catch(e) {
    return returnGetJobFailed(res);
  }
};

module.exports = { login, getJobList, getJobDetail };
