import { createLazyFileRoute } from '@tanstack/react-router'

import { Profile } from '@/widgets/profile'

export const Route = createLazyFileRoute('/_home/_authenticated/profile')({
  component: Profile,
})
