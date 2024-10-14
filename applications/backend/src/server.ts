import { buildFastify } from './app'
import { globalConfig } from './configs/global.config'

const app = await buildFastify()

app.listen(
  { port: globalConfig.fastify.port, host: globalConfig.fastify.host },
  (error) => {
    if (!error) {
      app.log.info('Server successfully started')
      return
    }

    process.exit(1)
  },
)
