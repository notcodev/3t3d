import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { connectToDatabase, db } from './connection'

const migrateData = async () => {
  await connectToDatabase()
  await migrate(db, { migrationsFolder: './drizzle/migrations' })
  console.log('Migration completed')
  process.exit(0)
}

migrateData().catch((error) => {
  console.error('Error migrating database', error)
  process.exit(1)
})
