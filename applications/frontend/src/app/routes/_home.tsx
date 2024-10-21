import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home')({
  pendingComponent: () => <div>Loading</div>,
})
