import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

export default db; 