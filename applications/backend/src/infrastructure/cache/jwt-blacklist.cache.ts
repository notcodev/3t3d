import Redis from 'ioredis'

import { globalConfig } from '@/configs/global.config'

import { redisClient } from './client'

class JwtBlacklistCache {
  private readonly prefix = 'jwt-blacklist:'

  constructor(private readonly redisClient: Redis) {}

  async add(jti: string) {
    await this.redisClient.setex(
      this.prefix + jti,
      globalConfig.security.accessTokenLifetime,
      1,
    )
  }

  async isExist(jti: string) {
    return Boolean(await this.redisClient.exists(this.prefix + jti))
  }
}

export const jwtBlacklistCache = new JwtBlacklistCache(redisClient)
