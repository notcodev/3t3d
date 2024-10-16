import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import * as schema from './schema'

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
})

const connectToDatabase = async (
  {
    logger,
  }: {
    logger: Record<'info' | 'error', (msg: string, ...args: unknown[]) => void>
  } = { logger: console },
) => {
  await pool.connect().then(
    () => {
      logger.info('Connected to the database')
    },
    (error) => {
      logger.error('Failed to connect to the database', error)
      process.exit(1)
    },
  )
}

export const disconnectFromDatabase = async () => {
  await pool.end()
}

const db = drizzle(pool, { schema, casing: 'snake_case' })
export { connectToDatabase, db }
