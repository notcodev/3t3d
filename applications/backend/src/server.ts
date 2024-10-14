import { connectToDatabase } from '@drizzle/connection'

import { buildFastify } from './app'
import { globalConfig } from './configs/global.config'

const app = await buildFastify()

await connectToDatabase()

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
