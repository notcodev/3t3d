import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routingModel } from '@/shared/routing'

import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  notFoundMode: 'root',
})

routingModel.attachRouter(router)

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const App = () => {
  return <RouterProvider router={router} />
}
