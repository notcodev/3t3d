import { globalConfig } from '@/configs/global.config'
import { db } from '@drizzle/connection'
import fp from 'fastify-plugin'
import * as Jwt from '@/jwt'
import { jwtBlacklistCache } from '@/infrastructure'

declare module 'fastify' {
  interface FastifyRequest {
    session: { userId: number; jti: string } | { userId: null; jti: null }
  }
}

export const authorizationPlugin = fp((fastify, _options, done) => {
  fastify.decorateRequest('userId', null)

  fastify.addHook('onRequest', async (request) => {
    async function getSession() {
      const jwt = request.headers.authorization?.split(' ')[1]
      if (!jwt) return

      const verifyResult = Jwt.verifyAccess(jwt)
      if (!verifyResult.valid) return

      const isBlacklisted = await jwtBlacklistCache.isExist(
        verifyResult.payload.jti,
      )
      if (isBlacklisted) return

      const userId = Number(verifyResult.payload.sub)
      const jti = verifyResult.payload.jti

      if (Number.isNaN(userId)) return

      // eslint-disable-next-line require-atomic-updates
      return { userId, jti }
    }
    const session = await getSession()
    request.session = session || { userId: null, jti: null }
  })

  done()
})
