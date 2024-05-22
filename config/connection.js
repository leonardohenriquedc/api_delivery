import postgres from "postgres";
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.URL_CONECTION

export const sql = postgres(URL, {ssl: 'import'})
