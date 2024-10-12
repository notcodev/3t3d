import { globalConfig } from '@/configs/global.config'
import Redis from 'ioredis'

export const redisClient = new Redis(globalConfig.redis.url)
