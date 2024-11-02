import { createLazyFileRoute } from '@tanstack/react-router'

import { Login } from '@/widgets/login'

export const Route = createLazyFileRoute('/_home/_anonymous/login')({
  component: Login,
})
