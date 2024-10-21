import {
  createLazyFileRoute,
  Outlet,
  ToPathOption,
  useMatchRoute,
  useNavigate,
} from '@tanstack/react-router'
import { ReactNode } from 'react'

import { useAsyncSideEffectState } from '@/shared/lib/react/use-async-side-effect-state'
import { AppRouter } from '@/shared/routing'
import { Button, Dialog, DialogContent, DialogTrigger } from '@/shared/ui'

export const Route = createLazyFileRoute('/_home')({
  component: HomePage,
})

function DialogRoute({
  to,
  renderTrigger,
}: {
  to: ToPathOption<AppRouter>
  renderTrigger: (params: { isPending: boolean }) => ReactNode
}) {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  // TODO: Add debounce for isPending
  const [isOpen, setIsOpen, { isPending }] = useAsyncSideEffectState(
    Boolean(matchRoute({ to })),
    {
      beforeChange: (isOpen) => {
        if (isOpen) return navigate({ to })

        const timeoutId = setTimeout(() => navigate({ to: '..' }), 200)
        return () => clearTimeout(timeoutId)
      },
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{renderTrigger({ isPending })}</DialogTrigger>
      <DialogContent>
        <Outlet />
      </DialogContent>
    </Dialog>
  )
}

function HomePage() {
  return (
    <div className="flex w-full justify-center h-screen items-center">
      <div className="flex flex-col gap-4 w-72">
        <DialogRoute
          to="/profile"
          renderTrigger={() => <Button className="w-full">Profile</Button>}
        />
        <DialogRoute
          to="/login"
          renderTrigger={() => <Button className="w-full">Login</Button>}
        />
      </div>
    </div>
  )
}
