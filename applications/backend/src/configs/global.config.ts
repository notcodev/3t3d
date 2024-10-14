import { Config } from './config.interface'
import { env } from './env'

export const globalConfig: Config = {
  fastify: {
    host: env.WEB_SERVER_HOST,
    port: env.WEB_SERVER_PORT,
  },
  security: {
    cookiesSecret: env.COOKIES_SECRET,
    accessTokenSecret: env.JWT_ACCESS_SECRET,
    accessTokenLifetime: 30 * 60,
    refreshTokenSecret: env.JWT_REFRESH_SECRET,
    refreshTokenLifetime: 30 * 24 * 60 * 60,
  },
  redis: {
    url: env.REDIS_URL,
  },
}
