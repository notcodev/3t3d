import { connectToDatabase } from '@drizzle/connection'

import { buildFastify } from './app'
import { globalConfig } from './configs'
import { redisConnect } from './infrastructure'

const app = await buildFastify()

await connectToDatabase({ logger: app.log })
await redisConnect({ logger: app.log })

app.listen(
  { port: globalConfig.fastify.port, host: globalConfig.fastify.host },
  (error) => {
    if (!error) return

    app.log.error('Failed to start server', error)
    process.exit(1)
  },
)
