// db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

console.log("Connecting with password:", process.env.DB_PASSWORD); // Optional debug

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,  // ✅ matches .env key
  database: process.env.DB_NAME
}).promise();

export default pool;
