import Redis from 'ioredis'

import { globalConfig } from '@/configs/global.config'

export const redisClient = new Redis(globalConfig.redis.url, {
  lazyConnect: true,
})

export function redisConnect(
  {
    logger,
  }: {
    logger: Record<'info' | 'error', (msg: string, ...args: unknown[]) => void>
  } = { logger: console },
) {
  return new Promise<void>((res) =>
    redisClient.connect((error) => {
      if (error) {
        logger.error('Failed to connect to Redis', error)
        process.exit(1)
      }

      logger.info('Connected to Redis')
      res()
    }),
  )
}
