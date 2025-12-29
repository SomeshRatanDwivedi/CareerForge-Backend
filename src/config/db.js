import dotenv from "dotenv";
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if(!connectionString)throw new Error('Databse connection string is not available.')
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  family: 4, // 🔥 FORCE IPv4
});

(async () => {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed', err);
  }
})();

export default sql;
