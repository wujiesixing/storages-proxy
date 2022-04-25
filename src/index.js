/* eslint-disable no-underscore-dangle */
import storage from './storage';

window.__STORAGES_DEFAULT__ = {
  localStorage: {
    domain: null,
    path: null,
  },
  sessionStorage: {
    domain: null,
    path: null,
  },
};

const localStorage = storage('localStorage');

function createGlobalLocalStorage({ domain, path } = {}) {
  window.__STORAGES_DEFAULT__.localStorage = { domain, path };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    enumerable: true,
    value: localStorage,
  });
}

const sessionStorage = storage('sessionStorage');

function createGlobalSessionStorage({ domain, path } = {}) {
  window.__STORAGES_DEFAULT__.sessionStorage = { domain, path };
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
