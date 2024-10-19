import { Button } from '@/shared/ui'

export const App = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-4">
      <Button variant="default">Click me</Button>
      <Button variant="destructive">Don't click me!</Button>
      <Button disabled>You can't click me ;)</Button>
    </div>
  )
}
