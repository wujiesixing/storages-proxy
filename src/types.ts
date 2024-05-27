export type Type = 'localStorage' | 'sessionStorage';

export type Path = string | (() => string);

export type Options = { path: Path, include?: string[],  exclude?: string[]};

declare global {
  interface Window {
    __STORAGES_DEFAULT__: Record<Type, Options>;
    __STORAGES_INIT__: Record<Type, boolean>;
  }
}
