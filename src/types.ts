export type Type = 'localStorage' | 'sessionStorage';

export type Path = string | (() => string);

export type Attrs = { path: Path };

declare global {
  interface Window {
    __STORAGES_DEFAULT__: Record<Type, Attrs>;
    __STORAGES_INIT__: Record<Type, boolean>;
  }
}
