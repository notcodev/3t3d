import { FastifyLoggerOptions } from 'fastify'
import { PinoLoggerOptions } from 'fastify/types/logger'

import { env } from './env'

export const loggerConfig = (
  {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
    staging: false,
  } satisfies Record<
    typeof env.NODE_ENV,
    FastifyLoggerOptions | PinoLoggerOptions | boolean
  >
)[env.NODE_ENV]
