const { Router } = require('express');
const { login, getJobList, getJobDetail } = require('./controllers');
const { verifyToken } = require('./middlewares');
const router = Router();

/*
Authentication
*/
router.post('/api/login', login);

/*
Jobs
*/
router.get('/api/jobs', verifyToken, getJobList);
router.get('/api/jobs/:id', verifyToken, getJobDetail);

module.exports = router;
