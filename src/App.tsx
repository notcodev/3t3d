import { OrbitControls, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, Vector3 } from '@react-three/fiber'
import { useUnit } from 'effector-react'
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  BufferGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  NormalBufferAttributes,
} from 'three'
import { model } from './model'
import { selectCell } from './utils/select-cell'

const BOX_SIZE = 1

const getCoordinates = (gap: number) => {
  return [-(BOX_SIZE + gap), 0, BOX_SIZE + gap] as const
}

const Cell = ({
  position,
  coordinates,
}: {
  coordinates: Vector3
  position: [number, number, number]
}) => {
  const ref = useRef<Mesh<BufferGeometry<NormalBufferAttributes>> | null>(null)

  const hovered = useRef(false)
  const { $shape: shape, cellClicked } = useUnit(
    model.field[selectCell(position)],
  )

  useFrame(() => {
    if (!ref.current) return
    ;(ref.current.material as MeshBasicMaterial).opacity = MathUtils.lerp(
      (ref.current.material as MeshBasicMaterial).opacity,
      hovered.current ? 1 : 0.35,
      0.1,
    )
  })

  if (!shape) {
    return (
      <RoundedBox
        ref={ref}
        onClick={(event) => {
          event.stopPropagation()
          cellClicked()
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          hovered.current = true
        }}
        onPointerOut={() => {
          hovered.current = false
        }}
        args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]}
        radius={0.1}
        position={coordinates}
      >
        <meshLambertMaterial color="#abd6e4" opacity={0.35} transparent />
      </RoundedBox>
    )
  }

  return (
    <RoundedBox
      args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]}
      radius={0.1}
      position={coordinates}
    >
      <meshLambertMaterial
        color={shape === 'cross' ? 'red' : 'green'}
        transparent
      />
    </RoundedBox>
  )
}

const ExpandContext = createContext<{
  expanded: boolean
  setExpanded: Dispatch<SetStateAction<boolean>>
} | null>(null)

const ExpantContextProvider = ({ children }: PropsWithChildren) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <ExpandContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </ExpandContext.Provider>
  )
}

const useExpandContext = () => {
  const ctx = useContext(ExpandContext)

  if (ctx === null) {
    throw new Error(
      'Hook "useExpandContext" called outside of ExpantContextProvider',
    )
  }

  return ctx
}

const Overlay = () => {
  const gameState = useUnit(model.$gameState)
  const { expanded, setExpanded } = useExpandContext()

  return (
    <main id="overlay">
      <button onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? 'Close' : 'Open'}
      </button>
      <span>{gameState}</span>
    </main>
  )
}

const Scene = () => {
  const { expanded } = useExpandContext()
  const coordinates = getCoordinates(expanded ? 1 : 0.25)

  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight
        castShadow
        position={[10, 20, 15]}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-left={-8}
        shadow-camera-bottom={-8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        intensity={2}
        shadow-bias={-0.0001}
      />

      {coordinates.map((x, indexX) =>
        coordinates.map((y, indexY) =>
          coordinates.map((z, indexZ) => (
            <Cell
              key={`${x}:${y}:${z}`}
              coordinates={[x, y, z]}
              position={[indexX, indexY, indexZ]}
            />
          )),
        ),
      )}

      <OrbitControls autoRotate={true} />
    </Canvas>
  )
}

export const App = () => {
  return (
    <ExpantContextProvider>
      <Scene />
      <Overlay />
    </ExpantContextProvider>
  )
}
