import { Outlet, ToPathOption, useNavigate } from '@tanstack/react-router'
import { useUnit } from 'effector-react'
import { ReactNode, useEffect, useId } from 'react'

import { useAsyncSideEffectState } from '@/shared/lib/react'
import { AppRouter } from '@/shared/routing'
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui'

import { dialogRouteModel } from './model'

export function DialogRoute({
  entryPoint,
  renderTrigger,
}: {
  entryPoint: ToPathOption<AppRouter>
  renderTrigger: (params: { isPending: boolean }) => ReactNode
}) {
  const id = useId()
  const navigate = useNavigate()
  const closingComplete = useUnit(dialogRouteModel.closingComplete)
  const componentUnmounted = useUnit(dialogRouteModel.componentUnmounted)

  useEffect(
    () => () => {
      componentUnmounted({ id })
    },
    [componentUnmounted, id],
  )

  const [isOpen, setIsOpen, { isPending }] = useAsyncSideEffectState(false, {
    beforeChange: (futureIsOpen, { abort }) => {
      if (futureIsOpen) {
        dialogRouteModel.openingBegan({
          id,
          abort,
          close: () => setIsOpen(false),
        })
        return navigate({ to: entryPoint })
      }

      const timeoutId = setTimeout(
        () => navigate({ to: '..' }).then(closingComplete),
        200,
      )
      return () => clearTimeout(timeoutId)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{renderTrigger({ isPending })}</DialogTrigger>
      <DialogContent>
        <Outlet />
      </DialogContent>
    </Dialog>
  )
}
