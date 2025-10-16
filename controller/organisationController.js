const express = require('express');
const { pool } = require('../event_db');
const router = express.Router();

// get organisations
router.get('/', (req, res) => {
  pool.query('SELECT * FROM organisations WHERE is_active=1 ORDER BY name')
    .then(([rows]) => res.json(rows))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'DB error' });
    });
});

// add organisation
router.post('/', async (req, res) => {
  const { name, mission_text, contact_email, contact_phone, website_url } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO organisations
        (name, mission_text, contact_email, contact_phone, website_url, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [name, mission_text || null, contact_email || null, contact_phone || null, website_url || null]
    );

    // execute insert
    const [rows] = await pool.query('SELECT * FROM organisations WHERE id=?', [result.insertId]);

    res.status(201).json({
      message: 'Organisation created',
      organisation: rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// update organisation
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, mission_text, contact_email, contact_phone, website_url, is_active } = req.body;

  try {
    // dynamic build SQL
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name=?'); params.push(name);
    }
    if (mission_text !== undefined) {
      updates.push('mission_text=?');
      params.push(mission_text);
    }
    if (contact_email !== undefined) {
      updates.push('contact_email=?');
      params.push(contact_email);
    }
    if (contact_phone !== undefined) {
      updates.push('contact_phone=?');
      params.push(contact_phone);
    }
    if (website_url !== undefined) {
      updates.push('website_url=?');
      params.push(website_url);
    }
    if (is_active !== undefined) {
      updates.push('is_active=?');
      params.push(is_active ? 1 : 0);
    }

    params.push(id);

    // execute update
    const [result] = await pool.query(
      `UPDATE organisations SET ${updates.join(', ')}, updated_at=NOW() WHERE id=?`,
      params
    );

    // query organisation after update
    const [rows] = await pool.query('SELECT * FROM organisations WHERE id=?', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    res.json({
      message: 'Organisation updated',
      organisation: rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// delete organisation
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // execute delete
    const [result] = await pool.query('DELETE FROM organisations WHERE id=?', [id]);
    res.json({ message: 'Organisation deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
});

module.exports = router
