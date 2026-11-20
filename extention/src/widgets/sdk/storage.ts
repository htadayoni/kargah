import { storage } from '@/lib/storage';

/** Namespaces values by widget and, optionally, project; this is not a security boundary. */
export function createWidgetStorage(widgetId: string, projectId?: string) {
  if (!/^[a-z][a-z0-9-]*$/.test(widgetId)) throw new Error('Invalid widget ID');
  const prefix = `kargah:widget:${encodeURIComponent(widgetId)}:${projectId === undefined ? 'global' : `project:${encodeURIComponent(projectId)}`}:`;
  function key(name: string) {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error('Invalid widget storage key');
    return prefix + name;
  }
  return {
    get: <T,>(name: string) => storage.get<T>(key(name)),
    set: <T,>(name: string, value: T) => storage.set(key(name), value),
  };
}
