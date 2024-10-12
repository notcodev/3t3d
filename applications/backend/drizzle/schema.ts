import {
  bigint,
  bigserial,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: bigserial({ mode: 'number' }).primaryKey(),
  firstName: varchar({ length: 64 }).notNull(),
  lastName: varchar({ length: 64 }),
  username: varchar({ length: 32 }).notNull().unique(),
  passwordHash: varchar({ length: 60 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: serial().primaryKey(),
  tokensId: uuid().notNull().unique(),
  userId: bigint({ mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ip: varchar({ length: 16 }).notNull(),
  userAgent: varchar({ length: 255 }),
  expiresAt: timestamp().notNull(),
  refreshedAt: timestamp().defaultNow().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})
