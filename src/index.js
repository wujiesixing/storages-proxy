/* eslint-disable no-underscore-dangle */
import storage from './storage';

window.__STORAGES_DEFAULT__ = {
  localStorage: {
    path: null,
  },
  sessionStorage: {
    path: null,
  },
};

const localStorage = storage('localStorage');

function createGlobalLocalStorage({ path } = {}) {
  window.__STORAGES_DEFAULT__.localStorage = { path };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    enumerable: true,
    value: localStorage,
  });
}

const sessionStorage = storage('sessionStorage');

function createGlobalSessionStorage({ path } = {}) {
  window.__STORAGES_DEFAULT__.sessionStorage = { path };
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
