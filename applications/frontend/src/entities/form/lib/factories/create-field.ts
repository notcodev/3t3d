import {
  createEvent,
  createStore,
  EventCallable,
  sample,
  StoreWritable,
  UnitValue,
} from 'effector'
import { ZodIssueCode, ZodSchema } from 'zod'

export type WidenLiterals<T> = T extends boolean
  ? boolean
  : T extends string
    ? string
    : T extends number
      ? number
      : T

export interface Field<V, E> {
  '$value': StoreWritable<WidenLiterals<V>>
  '$errors': StoreWritable<E[] | null>
  'changed': EventCallable<WidenLiterals<V>>
  '@@unitShape': () => Omit<Field<V, E>, '@@unitShape'>
}

export type FieldValue<F extends Field<unknown, unknown>> = UnitValue<
  F['$value']
>

export type ValidateFn<V, E> = (value: WidenLiterals<V>) => E[] | null

export function createField<V, E>(
  initialValue: WidenLiterals<V>,
  options?: {
    validate?: { on: EventCallable<any>; fn: ValidateFn<V, E> }
    clearOn?: EventCallable<any>
  },
): Field<V, E> {
  const changed = createEvent<WidenLiterals<V>>()
  const $value = createStore<WidenLiterals<V>>(initialValue)
  const $errors = createStore<E[] | null>(null)

  $value.on(changed, (_, value) => value)

  if (options?.validate) {
    const { fn, on } = options.validate
    sample({ clock: on, source: $value, fn, target: $errors })
  }

  if (options?.clearOn) {
    sample({ clock: options.clearOn, fn: () => initialValue, target: $value })
  }

  const unit = { $value, $errors, changed }
  return { ...unit, '@@unitShape': () => unit }
}

export const zodAdapter = <S extends ZodSchema<V>, V>(schema: S) => {
  return (value: V): ZodIssueCode[] | null => {
    const validationResult = schema.safeParse(value)

    if (validationResult.success) {
      return null
    }

    return validationResult.error.issues.map((issue) => issue.code)
  }
}
