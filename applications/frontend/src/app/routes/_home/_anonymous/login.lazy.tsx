import { createLazyFileRoute, Link } from '@tanstack/react-router'

import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

export const Route = createLazyFileRoute('/_home/_anonymous/login')({
  component: () => (
    <>
      <DialogHeader>
        <DialogTitle>It's login</DialogTitle>
        <DialogDescription>Example</DialogDescription>
      </DialogHeader>
      <Button asChild>
        <Link to="/signup">Register</Link>
      </Button>
    </>
  ),
})
