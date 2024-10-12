export interface FastifyConfig {
  port: number
  host: string
}

export interface SecurityConfig {
  accessTokenSecret: string
  accessTokenLifetime: number
  refreshTokenSecret: string
  refreshTokenLifetime: number
  cookiesSecret: string
}

export interface RedisConfig {
  url: string
}

export interface Config {
  fastify: FastifyConfig
  security: SecurityConfig
  redis: RedisConfig
}
