export function reshapeRecordValues<
  Key extends string | symbol | number,
  Value,
  NewValue,
>(
  obj: Record<Key, Value>,
  cb: (value: Value) => NewValue,
): Record<Key, NewValue> {
  return Object.fromEntries(
    Object.entries<Value>(obj).map(([key, value]) => [key, cb(value)]),
  ) as Record<Key, NewValue>
}
