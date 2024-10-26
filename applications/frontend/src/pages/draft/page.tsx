import {
  OrbitControls,
  OrbitControlsProps,
  RoundedBox,
} from '@react-three/drei'
import { ForwardRefComponent } from '@react-three/drei/helpers/ts-utils'
import { Canvas, useFrame, Vector3 as Vector3Fiber } from '@react-three/fiber'
import { useUnit } from 'effector-react'
import { forwardRef, useRef } from 'react'
import {
  BufferGeometry,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
  Vector3,
} from 'three'

import { Shape } from '@/shared/types/game'
import { selectCell } from '@/shared/utils/select-cell'

import { Layout } from './components/layout'
import {
  AutoRotateContextProvider,
  useAutoRotateContextRef,
} from './contexts/autorotate'
import { ExpandContextProvider, useExpandContextRef } from './contexts/expand'
import { model } from './model'

const BOX_SIZE = 1

const getCoordinates = (gap: number) => {
  return [-(BOX_SIZE + gap), 0, BOX_SIZE + gap] as const
}

const cellColor: Record<Shape, string> = {
  cross: 'red',
  ring: 'green',
  plus: 'blue',
  cylinder: 'purple',
}

const Cell = forwardRef<
  Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  >,
  {
    coordinates: Vector3Fiber
    position: [number, number, number]
  }
>(({ position, coordinates }, parentRef) => {
  const ref = useRef<Mesh<BufferGeometry<NormalBufferAttributes>> | null>(null)

  const hovered = useRef(false)
  const { $shape: shape, cellClicked } = useUnit(
    model.field[selectCell(position)],
  )

  useFrame(() => {
    if (!ref.current) return
    ;(ref.current.material as MeshBasicMaterial).opacity = MathUtils.lerp(
      (ref.current.material as MeshBasicMaterial).opacity,
      hovered.current ? 1.2 : 0.4,
      0.1,
    )
  })

  if (!shape) {
    return (
      <RoundedBox
        ref={(element) => {
          ref.current = element

          if (parentRef) {
            if (typeof parentRef === 'function') {
              parentRef(element)
            } else {
              parentRef.current = element
            }
          }
        }}
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
      <meshLambertMaterial color={cellColor[shape]} transparent />
    </RoundedBox>
  )
})

const Field = () => {
  const cells = useRef<
    {
      position: Record<'x' | 'y' | 'z', number>
      element: Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[],
        Object3DEventMap
      >
    }[]
  >([])
  const expanded = useExpandContextRef()
  const coordinates = getCoordinates(0.25)

  useFrame(() => {
    cells.current.forEach(({ element, position }) => {
      const coordinates = getCoordinates(expanded.current ? 1 : 0.25)

      const x = coordinates[position.x]
      const y = coordinates[position.y]
      const z = coordinates[position.z]

      element.position.lerp(new Vector3(x, y, z), 0.1)
    })
  })

  return (
    <group>
      {coordinates.map((x, indexX) =>
        coordinates.map((y, indexY) =>
          coordinates.map((z, indexZ) => (
            <Cell
              key={`${x}:${y}:${z}`}
              ref={(element) => {
                if (element) {
                  cells.current.push({
                    position: { x: indexX, y: indexY, z: indexZ },
                    element,
                  })
                }
              }}
              coordinates={[x, y, z]}
              position={[indexX, indexY, indexZ]}
            />
          )),
        ),
      )}
    </group>
  )
}

type OrbitControlsImpl =
  typeof OrbitControls extends ForwardRefComponent<OrbitControlsProps, infer E>
    ? E
    : never

const Controls = () => {
  const ref = useRef<OrbitControlsImpl | null>(null)
  const autoRotate = useAutoRotateContextRef()

  useFrame(() => {
    if (!ref.current) return

    ref.current.autoRotate = autoRotate.current
  })

  return <OrbitControls ref={ref} autoRotate={autoRotate.current} />
}

const Scene = () => {
  return (
    <Canvas camera={{ position: [6, 6, 6] }}>
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

      <Field />
      <Controls />
    </Canvas>
  )
}

export const App = () => {
  return (
    <ExpandContextProvider>
      <AutoRotateContextProvider>
        <Layout>
          <Scene />
        </Layout>
      </AutoRotateContextProvider>
    </ExpandContextProvider>
  )
}
