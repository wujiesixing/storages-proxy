import { escapeRegExp, isNil } from 'lodash-es';
import type { Path, Type } from './types';

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

export function getPrefix(type: Type, path?: Path) {
  return `path=${formatPath(type, path)};`;
}

export function isInclude(key: string, type: Type) {
  if(window.__STORAGES_DEFAULT__[type].include) {
    return (window.__STORAGES_DEFAULT__[type].include as string[]).includes(key)
  }

  if(window.__STORAGES_DEFAULT__[type].exclude) {
    return !(window.__STORAGES_DEFAULT__[type].exclude as string[]).includes(key)
  }

  return true
}

export function getKey(key: string | symbol, type: Type, path?: Path) {
  if (typeof key === 'symbol') return key;

  if(!isInclude(key, type)) return key;

  return `${getPrefix(type, path)}${key}=`;
}

export default function storage(type: Type) {
  return new Proxy(window[type], {
    set(target, property, value) {
      return Reflect.set(target, getKey(property, type), value);
    },

    get(target, property) {
      if (property === 'setItem') {
        return (key: string, value: string, path?: Path | null) => {
          if (path === null) {
            return target.setItem(key, value);
          }

          return target.setItem(getKey(key, type, path) as string, value);
        };
      }

      if (property === 'getItem') {
        return (key: string, path?: Path | null) => {
          if (path === null) {
            return target.getItem(key);
          }

          return target.getItem(getKey(key, type, path) as string);
        };
      }

      if (property === 'removeItem') {
        return (key: string, path?: Path | null) => {
          if (path === null) {
            return target.removeItem(key);
          }

          return target.removeItem(getKey(key, type, path) as string);
        };
      }

      if (property === 'key') {
        return (num: number, path?: Path | null) => {
          if (path === null) {
            return target.key(num);
          }

          const reg = new RegExp(
            `^${escapeRegExp(getPrefix(type, path))}(.+)=$`,
          );

          let index = 0;

          for (const key of Object.keys(target)) {
            if(!isInclude(key, type)) {
              if (num === index) return key;

              ++index;

              continue;
            }

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
        return (path?: Path | null) => {
          if (path === null) {
            return target.clear();
          }

          const reg = new RegExp(
            `^${escapeRegExp(getPrefix(type, path))}.+=$`,
          );

          Object.keys(target).forEach((key) => {
            if (!isInclude(key, type) || reg.test(key)) {
              target.removeItem(key);
            }
          });

          return undefined;
        };
      }

      if (property === 'length') {
        const reg = new RegExp(`^${escapeRegExp(getPrefix(type))}.+=$`);

        return Object.keys(target).filter((key) => {
          if(!isInclude(key, type)) return true;
          
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
