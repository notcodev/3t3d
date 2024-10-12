import ws from '@fastify/websocket'
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import fastify from 'fastify'

import { createContext } from './context'
import { AppRouter, appRouter } from './routers'
import { authorizationPlugin } from './plugins/authorization.plugin'
import { fastifyCookie } from '@fastify/cookie'
import { globalConfig } from './configs/global.config'

const app = fastify({
  maxParamLength: 5000,
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

app.listen({ port: 3000 }, (error) => {
  if (!error) {
    app.log.info('Server successfully started')
    return
  }

  process.exit(1)
})
