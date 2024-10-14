import { db } from '@drizzle/connection'
import { sessions, users } from '@drizzle/schema'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import * as uuid from 'uuid'

import { globalConfig } from '@/configs/global.config'
import * as Jwt from '@/jwt'

export async function login({
  username,
  password,
  ip,
  userAgent,
}: {
  username: string
  password: string
  ip: string
  userAgent: string | undefined
}) {
  const selectedRows = await db
    .select()
    .from(users)
    .where(eq(users.username, username))

  if (selectedRows.length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'INVALID_USERNAME_OR_PASSWORD',
    })
  }

  const user = selectedRows[0]
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordValid) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'INVALID_USERNAME_OR_PASSWORD',
    })
  }

  const jti = uuid.v7()
  const accessToken = Jwt.signAccess({ jti, sub: user.id.toString() })
  const refreshToken = Jwt.signRefresh({ jti, sub: user.id.toString() })

  await db.insert(sessions).values({
    userId: user.id,
    tokensId: jti,
    ip,
    userAgent,
    expiresAt: new Date(
      Date.now() + globalConfig.security.refreshTokenLifetime * 1000,
    ),
  })

  return { accessToken, refreshToken }
}

export async function signUp({
  username,
  firstName,
  lastName,
  password,
}: {
  username: string
  firstName: string
  lastName?: string
  password: string
}) {
  const candidates = await db
    .select()
    .from(users)
    .where(eq(users.username, username))

  if (candidates.length > 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'USERNAME_EXIST',
    })
  }

  const passwordHash = await bcrypt.hash(password, 7)
  const insertedRows = await db
    .insert(users)
    .values({ username, firstName, lastName, passwordHash })
    .returning({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
    })

  return insertedRows[0]
}