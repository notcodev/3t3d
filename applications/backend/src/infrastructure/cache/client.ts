import Redis from 'ioredis'

import { globalConfig } from '@/configs/global.config'

export const redisClient = new Redis(globalConfig.redis.url)
