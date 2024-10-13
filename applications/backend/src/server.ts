import { buildFastify } from './app'

const app = await buildFastify()

app.listen({ port: 3000 }, (error) => {
  if (!error) {
    app.log.info('Server successfully started')
    return
  }

  process.exit(1)
})
