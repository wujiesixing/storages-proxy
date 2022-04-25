/* eslint-disable no-underscore-dangle */
export default function storage(type) {
  function getKey(
    key,
    {
      domain = window.__STORAGES_DEFAULT__[type].domain ||
        window.location.hostname,
      path = window.__STORAGES_DEFAULT__[type].path ||
        window.location.pathname.replace(/\/[^/]*$/, '') ||
        '/',
    } = {},
  ) {
    if (typeof key === 'symbol') return key;
    return `domain=${domain};path=${path};${key}`;
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
          if (attrs) {
            const list = Object.keys(localStorage).filter((key) => {
              const reg = new RegExp(`^${getKey('', attrs)}.+`);
              return reg.test(key);
            });
            return list[num];
          }
          return target.key(num);
        };
      }
      if (property === 'clear') {
        return (attrs) => {
          if (attrs) {
            Object.keys(localStorage).forEach((key) => {
              const reg = new RegExp(`^${getKey('', attrs)}.+`);
              if (reg.test(key)) {
                Reflect.deleteProperty(target, getKey(key, attrs));
              }
            });
            return undefined;
          }
          return target.clear();
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
