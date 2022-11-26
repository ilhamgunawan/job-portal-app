const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./src/routes');
const app = express();
const port = process.env.PORT === undefined ? '3030' : process.env.PORT;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
