import { createLazyFileRoute } from '@tanstack/react-router'

import { DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui'

export const Route = createLazyFileRoute('/_home/_authenticated/profile')({
  component: () => (
    <>
      <DialogHeader>
        <DialogTitle>It's profile</DialogTitle>
        <DialogDescription>Example</DialogDescription>
      </DialogHeader>
    </>
  ),
})
