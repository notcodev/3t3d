import { createLazyFileRoute, Link } from '@tanstack/react-router'

import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

export const Route = createLazyFileRoute('/_home/_anonymous/signup')({
  component: () => (
    <>
      <DialogHeader>
        <DialogTitle>It's signup</DialogTitle>
        <DialogDescription>Example</DialogDescription>
      </DialogHeader>
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
    </>
  ),
})
