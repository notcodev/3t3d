import {
  bigint,
  bigserial,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const gameStatus = pgEnum('game_status', [
  'processing',
  'player1_won',
  'player2_won',
  'draw',
])

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  firstName: varchar('first_name', { length: 64 }).notNull(),
  lastName: varchar('last_name', { length: 64 }),
  username: varchar('username', { length: 32 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 60 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  tokensId: uuid('tokens_id').notNull().unique(),
  userId: bigint('user_id', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ip: varchar('ip', { length: 16 }).notNull(),
  userAgent: varchar('user_agent', { length: 255 }),
  expiresAt: timestamp('expires_at').notNull(),
  refreshedAt: timestamp('refreshed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const games = pgTable('games', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  player1Id: bigint('player1_id', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  player2Id: bigint('player2_id', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: gameStatus('status').default('processing'),
  finishedAt: timestamp('finished_at'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
})
