export function forEachValue<T>(
  obj: Record<symbol | number | string, T>,
  cb: Parameters<Array<T>['forEach']>[0],
): void {
  Object.values(obj).forEach(cb)
}
