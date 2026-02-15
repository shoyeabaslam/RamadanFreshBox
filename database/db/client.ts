import { Pool, PoolClient } from 'pg';
import { config } from 'dotenv';
config()
const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export const getClient = (): Promise<PoolClient> => pool.connect();

export const closePool = () => pool.end();

export default pool;
