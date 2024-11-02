import { createLazyFileRoute } from '@tanstack/react-router'

import { Signup } from '@/widgets/signup/ui'

export const Route = createLazyFileRoute('/_home/_anonymous/signup')({
  component: Signup,
})
