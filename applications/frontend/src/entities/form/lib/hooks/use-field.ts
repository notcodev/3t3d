import { useUnit } from 'effector-react'

import { Field } from '../factories'

export function useField<V, E>(field: Field<V, E>) {
  const { $value, $error, changed } = useUnit(field)

  return { value: $value, error: $error, changed }
}
