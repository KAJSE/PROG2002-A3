const express = require('express');
const { pool } = require('../event_db');

const router = express.Router();

// get categories
router.get('/', (req, res) => {
  const sql = `SELECT * FROM categories WHERE is_active=1 ORDER BY name`;

  pool.query(sql)
    .then(([rows]) => res.json(rows))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'DB error' });
    });
});

// add category
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO categories (name, description, is_active, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())',
      [name, description || null]
    );

    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id=?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Category created',
      category: rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// update category
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description, is_active } = req.body;

  try {
    // dynamic build SQL
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name=?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description=?');
      params.push(description);
    }
    if (is_active !== undefined) {
      updates.push('is_active=?');
      params.push(is_active ? 1 : 0);
    }

    params.push(id);

    // execute update
    const [result] = await pool.query(
      `UPDATE categories SET ${updates.join(', ')}, updated_at=NOW() WHERE id=?`,
      params
    );

    // query category after update
    const [rows] = await pool.query('SELECT * FROM categories WHERE id=?', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category updated',
      category: rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// delete category
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // execute delete
    const [result] = await pool.query('DELETE FROM categories WHERE id=?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
});


module.exports = router
