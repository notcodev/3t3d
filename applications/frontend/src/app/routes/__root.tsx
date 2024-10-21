import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

import { TanStackRouterDevtools } from '@/shared/utils/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
  notFoundComponent: () => <div>Not found</div>,
})
