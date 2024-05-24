import { escapeRegExp } from 'lodash-es';
import storage, { formatPath, getPrefix } from './storage';
import type { Attrs, Type } from './types';

const getPath = () => `/${window.location.pathname.split('/')[1] ?? ''}`;

window.__STORAGES_DEFAULT__ = {
  localStorage: {
    path: getPath(),
  },
  sessionStorage: {
    path: getPath(),
  },
};

window.__STORAGES_INIT__ = {
  localStorage: false,
  sessionStorage: false,
};

function createGlobalStorage(type: Type, attrs?: Attrs) {
  if (window.__STORAGES_INIT__[type]) {
    updateGlobalStorage(type, attrs);
  } else {
    window.__STORAGES_DEFAULT__[type] = {
      path: formatPath(type, attrs?.path ?? getPath()),
    };

    Object.defineProperty(window, type, {
      configurable: true,
      enumerable: true,
      value: storage(type),
    });

    window.__STORAGES_INIT__[type] = true;
  }
}

function updateGlobalStorage(type: Type, attrs?: Attrs) {
  window.__STORAGES_DEFAULT__[type] = {
    path: formatPath(type, attrs?.path ?? getPath()),
  };
}

function length(type: Type, attrs?: Attrs | null) {
  const keys = Object.keys(window[type]);

  if (attrs === null) {
    return keys.length;
  }

  return keys.filter((key) => {
    const reg = new RegExp(`^${escapeRegExp(getPrefix(type, attrs))}.+=$`);
    return reg.test(key);
  }).length;
}

export { createGlobalStorage, length, updateGlobalStorage };
