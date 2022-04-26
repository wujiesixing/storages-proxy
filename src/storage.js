/* eslint-disable no-underscore-dangle */

export const STORAGES_DEFAULT_PATH = 'null';

export function formatPath(path, type) {
  return (
    (path ??
      (type ? window.__STORAGES_DEFAULT__[type].path : STORAGES_DEFAULT_PATH) ??
      window.location.pathname.replace(/\/[^/]*$/, '')) ||
    '/'
  );
}

export default function storage(type) {
  function getPrefix({ path } = {}) {
    return `path=${formatPath(path, type)};`;
  }

  function getKey(key, attrs) {
    if (typeof key === 'symbol') return key;
    return `${getPrefix(attrs)}${key}=`;
  }

  const storageProxy = new Proxy(window[type], {
    set(target, property, value) {
      return Reflect.set(target, getKey(property), value);
    },
    get(target, property) {
      if (property === 'setItem') {
        return (key, value, attrs) =>
          Reflect.set(target, getKey(key, attrs), value);
      }
      if (property === 'getItem') {
        return (key, attrs) => Reflect.get(target, getKey(key, attrs));
      }
      if (property === 'removeItem') {
        return (key, attrs) =>
          Reflect.deleteProperty(target, getKey(key, attrs));
      }
      if (property === 'key') {
        return (num, attrs) => {
          if (attrs === null) {
            return target.key(num);
          }
          const list = Object.keys(localStorage).filter((key) => {
            const reg = new RegExp(`^${getPrefix(attrs)}.+`);
            return reg.test(key);
          });
          return list[num] ?? null;
        };
      }
      if (property === 'clear') {
        return (attrs) => {
          if (attrs === null) {
            return target.clear();
          }
          Object.keys(localStorage).forEach((key) => {
            const reg = new RegExp(`^${getPrefix(attrs)}.+`);
            if (reg.test(key)) {
              target.removeItem(key);
            }
          });
          return undefined;
        };
      }
      if (property === 'length') {
        return Reflect.get(target, property);
      }
      return Reflect.get(target, getKey(property));
    },
    deleteProperty(target, property) {
      return Reflect.deleteProperty(target, getKey(property));
    },
  });
  return storageProxy;
}
