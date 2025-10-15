const express = require('express');
const { pool } = require('../event_db');

const router = express.Router();

router.get('/', (req, res) => {
  const sql = `SELECT * FROM categories WHERE is_active=1 ORDER BY name`;

  pool.query(sql)
    .then(([rows]) => res.json(rows))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'DB error' });
    });
});

module.exports = router
