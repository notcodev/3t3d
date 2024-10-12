import { Config } from './config.interface'

export const globalConfig: Config = {
  fastify: {
    host: process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
    port: 3000,
  },
  security: {
    cookiesSecret: process.env.COOKIES_SECRET!,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    accessTokenLifetime: 30 * 60, // seconds
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    refreshTokenLifetime: 30 * 24 * 60 * 60, // seconds
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
}
