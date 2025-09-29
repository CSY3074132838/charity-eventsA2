require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

async function testConnection() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log(' DB connected');
}

async function query(sql, params=[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getEventsForHome() {
  const now = new Date();
  const rows = await query(`
    SELECT e.*, c.name AS category_name, o.name AS org_name
    FROM events e
    JOIN categories c ON c.id = e.category_id
    JOIN organisations o ON o.id = e.org_id
    WHERE e.status='active'
    ORDER BY e.start_time ASC
  `);
  return rows.filter(r => new Date(r.end_time) >= now);
}

async function getCategories() {
  return query(`SELECT id, slug, name FROM categories ORDER BY name`);
}

async function searchEvents({date, location, category}) {
  let where = "e.status='active'";
  const params = [];
  if (date) { where += " AND DATE(e.start_time)=?"; params.push(date); }
  if (location) { where += " AND e.city LIKE ?"; params.push(`%${location}%`); }
  if (category) { where += " AND c.slug=?"; params.push(category); }
  return query(`
    SELECT e.*, c.name AS category_name, o.name AS org_name
    FROM events e
    JOIN categories c ON c.id=e.category_id
    JOIN organisations o ON o.id=e.org_id
    WHERE ${where}
    ORDER BY e.start_time ASC
  `, params);
}
async function getEventById(id) {
  const [ev] = await query(`
    SELECT e.*, c.name AS category_name, o.name AS org_name
    FROM events e
    JOIN categories c ON c.id=e.category_id
    JOIN organisations o ON o.id=e.org_id
    WHERE e.id=? AND e.status<>'suspended' LIMIT 1
  `, [id]);
  if (!ev) return null;
  const tickets = await query(`SELECT * FROM tickets WHERE event_id=?`, [id]);
  return {...ev, tickets};
}

module.exports = {testConnection, getEventsForHome, getCategories, searchEvents, getEventById};
