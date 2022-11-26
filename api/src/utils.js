const returnLoginFailed = (res) => {
  return res.status(400).send({
    status: 'Bad request',
    data: null,
    message: 'Please provide valid username and password',
  });
};

const returnGetJobFailed = (res) => {
  return res.status(400).send({
    status: 'Bad request',
    data: null,
    message: 'Please provide valid parameters',
  });
};

const returnUnauthorized = (res) => {
  return res.status(401).send({
    status: 'Unauthorized',
    data: null,
    message: 'No token provided',
  });
};

module.exports = { returnLoginFailed, returnGetJobFailed, returnUnauthorized };
