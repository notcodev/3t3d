import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { log: req.log, session: req.session, res, req }
}

export type Context = Awaited<ReturnType<typeof createContext>>
