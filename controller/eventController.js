const express = require('express');
const { pool } = require('../event_db');

const router = express.Router();

router.get('/', (req, res) => {
  const {
    status = 'active',
    city,
    state,
    categoryId,
    start,
    end,
    q
  } = req.query;

  let where = 'WHERE e.is_suspended=0';
  if (status === 'active') {
    where += ' AND e.end_datetime >= NOW()'
  } else if (status === 'past') {
    where += ' AND e.end_datetime < NOW()'
  } else if (status === 'upcoming') {
    where += ' AND e.start_datetime >= NOW()'
  }

  const params = [];
  if (city) {
    where += ' AND e.city LIKE ?';
    params.push(`%${city}%`);
  }
  if (state) {
    where += ' AND e.state_region LIKE ?';
    params.push(`%${state}%`);
  }
  if (categoryId) {
    where += ' AND e.category_id = ?';
    params.push(categoryId);
  }
  if (start) {
    where += ' AND (e.start_datetime <= ? AND e.end_datetime >= ?)';
    params.push(start, start);
  }
  if (end) {
    where += ' AND (e.start_datetime <= ? AND e.end_datetime >= ?)';
    params.push(end, end);
  }
  if (q) {
    where += ' AND (e.name LIKE ? OR e.short_description LIKE ? OR e.venue_name LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const sql = `
    SELECT e.*, c.name AS category_name, o.name AS organisation_name
    FROM events e
    JOIN categories c ON c.id = e.category_id
    JOIN organisations o ON o.id = e.organisation_id
    ${where}
    ORDER BY e.start_datetime ASC
  `;

  pool.query(sql, params)
    .then(([rows]) => res.json(rows))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'DB error' });
    });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  const detailSql = `
    SELECT e.*, c.name AS category_name, o.name AS organisation_name, o.mission_text AS organisation_mission
    FROM events e
    JOIN categories c ON c.id = e.category_id
    JOIN organisations o ON o.id = e.organisation_id
    WHERE e.id = ?
  `;

  pool.query(detailSql, [id])
    .then(([rows]) => {
      if (!rows.length) {
        res.status(404).json({ message: 'Event not found' });
        return Promise.reject('handled');
      }
      const event = rows[0];

      const progressSql = `
        SELECT COALESCE(SUM(amount),0) AS progress_amount
        FROM registrations
        WHERE event_id = ? AND status='confirmed'
      `;
      const participantsSql = `
        SELECT COUNT(*) AS confirmed_count
        FROM registrations
        WHERE event_id = ? AND status='confirmed'
      `;
      const registrationsSql = `
        SELECT id, attendee_name, attendee_email, quantity, unit_price, amount, status, created_at
        FROM registrations
        WHERE event_id = ?
        ORDER BY created_at DESC
      `;

      return Promise.all([
        Promise.resolve(event),
        pool.query(progressSql, [id]),
        pool.query(participantsSql, [id]),
        pool.query(registrationsSql, [id]),
      ]);
    })
    .then(([event, [pRows], [cRows], [rRows]]) => {
      const progress_amount = parseFloat(pRows[0].progress_amount || 0);
      const goal = parseFloat(event.goal_amount || 0);
      const progress_percent = goal > 0 ? parseFloat(((progress_amount / goal) * 100).toFixed(1)) : null;

      res.json({
        ...event,
        progress_amount,
        progress_percent,
        confirmed_participants: cRows[0].confirmed_count,
        registrations: rRows,
      });
    })
    .catch((err) => {
      if (err === 'handled') return;
      console.error(err);
      res.status(500).json({ message: 'DB error' });
    });
});

router.post('/:id/register', async (req, res) => {
  const eventId = req.params.id;
  const { attendee_name, attendee_email, quantity, unit_price } = req.body;

  // validate required fields
  if (!attendee_name || !attendee_email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  // get quantity and price, calculate amount
  const qty = parseInt(quantity, 10) || 1;
  const price = parseFloat(unit_price) || 0.0;
  const amount = qty * price;

  try {
    // Check if the event exists and has not been paused
    const [eventRows] = await pool.query(
      'SELECT id, is_suspended FROM events WHERE id=?',
      [eventId]
    );
    if (!eventRows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (eventRows[0].is_suspended) {
      return res.status(400).json({ message: 'Event is suspended' });
    }

    // insert registration
    const [result] = await pool.query(
      `
      INSERT INTO registrations
        (event_id, attendee_name, attendee_email, quantity, unit_price, amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'confirmed', NOW())
      `,
      [eventId, attendee_name, attendee_email, qty, price, amount]
    );

    // query inserted row
    const [rows] = await pool.query(
      'SELECT * FROM registrations WHERE id=?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Registration successful',
      registration: rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
});


module.exports = router
