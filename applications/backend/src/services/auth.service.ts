import { db } from '@drizzle/connection'
import { sessions, users } from '@drizzle/schema'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import * as uuid from 'uuid'

import { globalConfig } from '@/configs/global.config'
import { atom } from '@/fabrics/atom'
import { jwtBlacklistCache } from '@/infrastructure'
import * as Jwt from '@/jwt'

export const authService = atom(() => {
  async function login({
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

  async function signUp({
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

  async function refresh({ refreshToken }: { refreshToken: string }) {
    const verifyTokenResult = Jwt.verifyRefresh(refreshToken)

    if (!verifyTokenResult.valid) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    const selectedRows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokensId, verifyTokenResult.payload.jti))

    if (selectedRows.length === 0) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    const sessionEntry = selectedRows[0]

    const newJti = uuid.v7()
    const newAccessToken = Jwt.signAccess({
      jti: newJti,
      sub: verifyTokenResult.payload.sub,
    })
    const newRefreshToken = Jwt.signRefresh({
      jti: newJti,
      sub: verifyTokenResult.payload.sub,
    })

    await db.transaction(async (tx) => {
      await tx
        .update(sessions)
        .set({
          tokensId: newJti,
          refreshedAt: new Date(),
          expiresAt: new Date(
            Date.now() + globalConfig.security.refreshTokenLifetime * 1000,
          ),
        })
        .where(eq(sessions.id, sessionEntry.id))
      await jwtBlacklistCache.add(verifyTokenResult.payload.jti)
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async function logout({ jti }: { jti: string }) {
    await db.transaction(async (tx) => {
      await tx.delete(sessions).where(eq(sessions.tokensId, jti))
      await jwtBlacklistCache.add(jti)
    })
  }

  return { login, signUp, refresh, logout }
})
