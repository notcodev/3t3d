import { type AppRouter } from '@3t3d/backend'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
})
