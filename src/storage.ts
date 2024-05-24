import { escapeRegExp, isNil } from 'lodash-es';
import type { Attrs, Path, Type } from './types';

export function formatPath(type: Type, path?: Path) {
  if (!isNil(path)) {
    if (typeof path === 'function') {
      return path();
    }

    return path;
  }

  if (typeof window.__STORAGES_DEFAULT__[type].path === 'function') {
    return (window.__STORAGES_DEFAULT__[type].path as () => string)();
  }

  return window.__STORAGES_DEFAULT__[type].path as string;
}

export function getPrefix(type: Type, attrs?: Attrs) {
  return `path=${formatPath(type, attrs?.path)};`;
}

export function getKey(key: string | symbol, type: Type, attrs?: Attrs) {
  if (typeof key === 'symbol') return key;

  return `${getPrefix(type, attrs)}${key}=`;
}

export default function storage(type: Type) {
  return new Proxy(window[type], {
    set(target, property, value) {
      return Reflect.set(target, getKey(property, type), value);
    },

    get(target, property) {
      if (property === 'setItem') {
        return (key: string, value: string, attrs?: Attrs | null) => {
          if (attrs === null) {
            return target.setItem(key, value);
          }

          return target.setItem(getKey(key, type, attrs) as string, value);
        };
      }

      if (property === 'getItem') {
        return (key: string, attrs?: Attrs | null) => {
          if (attrs === null) {
            return target.getItem(key);
          }

          return target.getItem(getKey(key, type, attrs) as string);
        };
      }

      if (property === 'removeItem') {
        return (key: string, attrs?: Attrs | null) => {
          if (attrs === null) {
            return target.removeItem(key);
          }

          return target.removeItem(getKey(key, type, attrs) as string);
        };
      }

      if (property === 'key') {
        return (num: number, attrs?: Attrs | null) => {
          if (attrs === null) {
            return target.key(num);
          }

          const reg = new RegExp(
            `^${escapeRegExp(getPrefix(type, attrs))}(.+)=$`,
          );

          let index = 0;

          for (const key of Object.keys(target)) {
            const match = key.match(reg);

            if (match?.[1]) {
              if (num === index) return match[1];

              ++index;
            }
          }

          return null;
        };
      }

      if (property === 'clear') {
        return (attrs?: Attrs | null) => {
          if (attrs === null) {
            return target.clear();
          }

          Object.keys(target).forEach((key) => {
            const reg = new RegExp(
              `^${escapeRegExp(getPrefix(type, attrs))}.+=$`,
            );
            if (reg.test(key)) {
              target.removeItem(key);
            }
          });

          return undefined;
        };
      }

      if (property === 'length') {
        return Object.keys(target).filter((key) => {
          const reg = new RegExp(`^${escapeRegExp(getPrefix(type))}.+=$`);
          return reg.test(key);
        }).length;
      }

      return Reflect.get(target, getKey(property, type));
    },

    deleteProperty(target, property) {
      return Reflect.deleteProperty(target, getKey(property, type));
    },
  });
}
