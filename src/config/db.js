import dotenv from "dotenv";
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if(!connectionString)throw new Error('Databse connection string is not available.')
const sql = postgres(connectionString);

export default sql
