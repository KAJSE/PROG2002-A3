const express = require('express');
const { pool } = require('./event_db');
const path = require('path');
const categoryController = require('./controller/categoryController');
const eventController = require('./controller/eventController');
const organisationController = require('./controller/organisationController');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

app.use('/categories', categoryController)
app.use('/events', eventController)
app.use('/organisations', organisationController)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
});
