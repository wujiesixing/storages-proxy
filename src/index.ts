import { escapeRegExp } from 'lodash-es';
import storage, { formatPath, getPrefix, isInclude } from './storage';
import type { Options, Path, Type } from './types';

const getPath = () => `/${window.location.pathname.split('/')[1] ?? ''}`;

function getDefaultOptions(): Options {
  return {
    path: getPath(),
  }
}

window.__STORAGES_DEFAULT__ = {
  localStorage: getDefaultOptions(),
  sessionStorage: getDefaultOptions(),
};

window.__STORAGES_INIT__ = {
  localStorage: false,
  sessionStorage: false,
};

function createGlobalStorage(type: Type, options?: Partial<Options> ) {
  updateGlobalStorage(type, options, true);

  if (window.__STORAGES_INIT__[type]) return;
  
  Object.defineProperty(window, type, {
    configurable: true,
    enumerable: true,
    value: storage(type),
  });

  window.__STORAGES_INIT__[type] = true;
}

function updateGlobalStorage(type: Type, options: Partial<Options> = getDefaultOptions(), force = false) {
  if(options?.include && options?.exclude) {
    throw new Error("Cannot configure INCLUDE and EXCLUDE at the same time.")
  }

  if(force) {
    window.__STORAGES_DEFAULT__[type] = {
      ...options,
      path: formatPath(type, options?.path ?? getPath()),
    };
  } else {
    Object.entries(options).forEach(([key, value]) => {
      if(key === 'path') {
        window.__STORAGES_DEFAULT__[type][key] = formatPath(type, value as Path)
      } else {
        window.__STORAGES_DEFAULT__[type][key as 'include' | 'exclude'] = value as string[]
      }
    })
  }
}

function length(type: Type, path?: Path | null) {
  const keys = Object.keys(window[type]);

  if (path === null) {
    return keys.length;
  }

  const reg = new RegExp(`^${escapeRegExp(getPrefix(type, path))}.+=$`);

  return keys.filter((key) => {
    if(!isInclude(key, type)) return true;
    
    return reg.test(key);
  }).length;
}

export { createGlobalStorage, length, updateGlobalStorage };
