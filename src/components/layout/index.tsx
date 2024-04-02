import { useUnit } from 'effector-react'
import { Maximize2, Minimize2, Rotate3D } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { useAutoRotateContextState } from '../../contexts/autorotate'
import { useExpandContextState } from '../../contexts/expand'
import { model } from '../../model'
import { Shape } from '../../types/game'
import { Button } from '../ui/button'
import classes from './styles.module.css'

const ExpandButton = () => {
  const [expanded, setExpanded] = useExpandContextState()

  return (
    <Button onClick={() => setExpanded((prev) => !prev)}>
      {!expanded ? <Maximize2 /> : <Minimize2 />}
    </Button>
  )
}

const AutoRotateButton = () => {
  const [autoRotate, setAutoRotate] = useAutoRotateContextState()

  return (
    <Button
      role="checkbox"
      aria-checked={autoRotate}
      onClick={() => setAutoRotate((prev) => !prev)}
    >
      <Rotate3D />
    </Button>
  )
}

export const Layout = ({ children }: PropsWithChildren) => {
  const shapeChanged = useUnit(model.shapeChanged)
  const currentPlayer = useUnit(model.$currentPlayer)
  const currentShape = useUnit(model.$currentShape)
  const gameState = useUnit(model.$gameState)

  return (
    <>
      <header className={classes.header}>
        <span>{gameState}</span>
        <span>{currentPlayer}</span>
        <span>{currentShape}</span>
        {Object.entries(model.shapeOwners)
          .filter(([_shape, player]) => player === currentPlayer)
          .map(([shape]) => (
            <button key={shape} onClick={() => shapeChanged(shape as Shape)}>
              {shape}
            </button>
          ))}
      </header>
      <main className={classes.main}>{children}</main>
      <footer className={classes.footer}>
        <ExpandButton />
        <AutoRotateButton />
      </footer>
    </>
  )
}
