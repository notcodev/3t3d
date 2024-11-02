import { createLazyFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/pages/home'

export const Route = createLazyFileRoute('/_home')({
  component: HomePage,
})
