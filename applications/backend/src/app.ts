import { fastifyCookie } from '@fastify/cookie'
import ws from '@fastify/websocket'
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import { fastify } from 'fastify'
import fastifyInjectTRPCPlugin from 'fastify-inject-trpc'

import { globalConfig, loggerConfig } from './configs'
import { authorizationPlugin } from './plugins'
import { type AppRouter, appRouter, createContext } from './trpc'

export async function buildFastify() {
  const app = fastify({
    maxParamLength: 5000,
    logger: loggerConfig,
  })

  app.register(fastifyCookie, { secret: globalConfig.security.cookiesSecret })
  app.register(authorizationPlugin)
  app.register(ws)
  app.register(fastifyTRPCPlugin, {
    useWSS: true,
    keepAlive: {
      enabled: true,
      pingMs: 30000,
      pongWaitMs: 5000,
    },
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        app.log.error(`Error in tRPC handler on path '${path}':`, error)
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  })
  await app.register(fastifyInjectTRPCPlugin, {
    router: appRouter,
    prefix: '/trpc',
  })

  return app.withTypedTRPCInjector<AppRouter>()
}
