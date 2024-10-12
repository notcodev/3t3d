import {
  bigint,
  bigserial,
  pgEnum,
  pgTable,
  serial,
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

export const games = pgTable('games', {
  id: serial().primaryKey(),
  player1Id: bigint({ mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  player2Id: bigint({ mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: gameStatus().default('processing'),
  finishedAt: timestamp(),
  startedAt: timestamp().defaultNow().notNull(),
})
