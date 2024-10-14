import { db } from '@drizzle/connection'
import { sessions, users } from '@drizzle/schema'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import * as uuid from 'uuid'
import { z } from 'zod'

import { globalConfig } from '@/configs/global.config'
import { jwtBlacklistCache } from '@/infrastructure'
import * as Jwt from '@/jwt'
import { authorizedProcedure, t } from '@/trpc'
import * as authService from '@/services/auth.service'

export const authRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        username: z.string().min(4).max(32),
        password: z.string().min(8).max(64),
      }),
    )
    .mutation(async ({ input: { username, password }, ctx }) => {
      const { accessToken, refreshToken } = await authService.login({
        username,
        password,
        ip: ctx.req.ip,
        userAgent: ctx.req.headers['user-agent'],
      })

      ctx.res.setCookie('refresh_token', refreshToken, {
        maxAge: globalConfig.security.refreshTokenLifetime,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      })

      return { accessToken }
    }),
  signUp: t.procedure
    .input(
      z.object({
        username: z.string().min(4).max(32),
        firstName: z.string().min(1).max(64),
        lastName: z.string().min(1).max(64).optional(),
        password: z.string().min(8).max(64),
      }),
    )
    .mutation(async ({ input }) => {
      return authService.signUp(input)
    }),
  refresh: t.procedure.mutation(async ({ ctx }) => {
    if (!ctx.req.cookies.refresh_token) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    const refreshTokenUnsignResult = ctx.req.unsignCookie(
      ctx.req.cookies.refresh_token,
    )

    if (!refreshTokenUnsignResult.valid) {
      ctx.res.clearCookie('refresh_token')
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    const { accessToken, refreshToken } = await authService
      .refresh({ refreshToken: refreshTokenUnsignResult.value })
      .catch((error) => {
        ctx.res.clearCookie('refresh_token')
        return Promise.reject(error)
      })

    ctx.res.setCookie('refresh_token', refreshToken, {
      maxAge: globalConfig.security.refreshTokenLifetime,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    })

    return { accessToken }
  }),
  logout: authorizedProcedure.mutation(async ({ ctx }) => {
    await db.transaction(async (tx) => {
      await tx.delete(sessions).where(eq(sessions.tokensId, ctx.session.jti))
      await jwtBlacklistCache.add(ctx.session.jti)
    })

    ctx.res.clearCookie('refresh_token')

    return { success: true }
  }),
})
