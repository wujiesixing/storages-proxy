/* eslint-disable no-underscore-dangle */
import storage, { formatPath, STORAGES_DEFAULT_PATH } from './storage';

window.__STORAGES_DEFAULT__ = {
  localStorage: {
    path: STORAGES_DEFAULT_PATH,
  },
  sessionStorage: {
    path: STORAGES_DEFAULT_PATH,
  },
};

const localStorage = storage('localStorage');

function createGlobalLocalStorage({ path } = {}) {
  window.__STORAGES_DEFAULT__.localStorage = { path: formatPath(path) };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    enumerable: true,
    value: localStorage,
  });
}

const sessionStorage = storage('sessionStorage');

function createGlobalSessionStorage({ path } = {}) {
  window.__STORAGES_DEFAULT__.sessionStorage = { path: formatPath(path) };
  Object.defineProperty(window, 'sessionStorage', {
    configurable: true,
    enumerable: true,
    value: sessionStorage,
  });
}

export {
  localStorage,
  sessionStorage,
  createGlobalLocalStorage,
  createGlobalSessionStorage,
};
