// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any

type OnlyFunctions<T extends object> = {
  [Key in keyof T]: T[Key] extends AnyFunction ? T[Key] : never
}

export function mockFunction<Target extends object>(
  target: Target,
  field: keyof OnlyFunctions<Target>,
  returns: ReturnType<OnlyFunctions<Target>[typeof field]>,
) {
  const targetInitial = target[field]
  const mockFn = (..._args: unknown[]) => {
    return returns
  }
  target[field] = mockFn as OnlyFunctions<Target>[typeof field]

  return {
    restore: () => {
      target[field] = targetInitial
    },
  }
}
