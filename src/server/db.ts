import pg from "pg";

const connectionString = process.env.DATABASE_URL;

export const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export async function initSchema() {
  // Tabelas mínimas para admin (unidades, serviços, barbeiros)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS units (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      timezone TEXT NOT NULL,
      address TEXT,
      open_time TEXT,
      close_time TEXT,
      capacity INT,
      is_active BOOLEAN DEFAULT true,
      days_of_week TEXT[]
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY,
      unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      duration_minutes INT NOT NULL,
      buffer_after_minutes INT NOT NULL,
      capacity INT NOT NULL,
      price NUMERIC,
      image TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS barbers (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT,
      units TEXT[],
      is_active BOOLEAN DEFAULT true
    );
  `);
}
