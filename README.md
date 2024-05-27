# storages-proxy

Add scopes to `localStorage` and `sessionStorage` to avoid global pollution, especially suitable for micro-frontend and other project scenarios.

[中文文档](README.zh-CN.md)

## Table of Contents

- [Installation](#installation)
- [API](#api)
  - [createGlobalStorage](#createglobalstorage)
  - [updateGlobalStorage](#updateglobalstorage)
- [Examples](#examples)
- [Type Definitions](#type-definitions)
- [License](#license)

## Installation

Install with npm:

```sh
npm install storages-proxy
```

Or install with pnpm:

```sh
pnpm add storages-proxy
```

## API

### createGlobalStorage

`createGlobalStorage(type: Type, options?: Partial<Options>): void`

Creates global storage of the specified type and sets the scope.

#### Parameters

- `type` (`Type`): Storage type, can be `localStorage` or `sessionStorage`.
- `options` (`Partial<Options>`, optional): Storage attribute configuration, including the path.

### updateGlobalStorage

`updateGlobalStorage(type: Type, options?: Partial<Options>, force?: boolean): void`

Updates the scope of the specified type of global storage.

#### Parameters

- `type` (`Type`): Storage type, can be `localStorage` or `sessionStorage`.
- `options` (`Partial<Options>`, optional): Storage attribute configuration, including the path.
- `force` (`boolean`, optional): Whether to reset the attribute configuration.

## Examples

```js
import {
  length,
  createGlobalStorage,
  updateGlobalStorage,
} from 'storages-proxy';

// Create `localStorage` and `sessionStorage` with default scope set to the current path
createGlobalStorage('localStorage');
createGlobalStorage('localStorage', { include: [ 'key' ] });

// Create `localStorage` and `sessionStorage` with the default scope set to a specified path
createGlobalStorage('localStorage', { path: '/path' });
createGlobalStorage('localStorage', { path: '/path', include: [ 'key' ] });

// Update the default scope of localStorage to the current path
updateGlobalStorage('localStorage');

// Update the default scope of localStorage to a specified path
updateGlobalStorage('localStorage', { path: '/new-path' });

// Set a key-value pair with the default scope
localStorage.key = 'value';
// or
localStorage.setItem('key1', 'value1');

// Set a key-value pair with a specified scope
localStorage.setItem('key2', 'value2', '/path');

// Set a key-value pair without using any scope
localStorage.setItem('key3', 'value3', null);

// Get a key-value pair with the default scope
console.log(localStorage.key); // Outputs 'value'
// or
console.log(localStorage.getItem('key1')); // Outputs 'value1'

// Get a key-value pair with a specified scope
console.log(localStorage.getItem('key2', '/path')); // Outputs 'value2'

// Get a key-value pair without using any scope
console.log(localStorage.getItem('key3', null)); // Outputs 'value3'

// Remove a key-value pair with the default scope
delete localStorage.key;
// or
localStorage.removeItem('key1');

// Remove a key-value pair with a specified scope
localStorage.removeItem('key2', '/path');

// Remove a key-value pair without using any scope
localStorage.removeItem('key3', null);

// Get the nth key name under the default scope
localStorage.key(0);

// Get the nth key name under a specified scope
localStorage.key(0, '/path');

// Get the nth key name without using any scope
localStorage.key(0, null);

// Clear all key-value pairs under the default scope
localStorage.clear();

// Clear all key-value pairs under a specified scope
localStorage.clear('/path');

// Clear all key-value pairs
localStorage.clear(null);

// Get the number of items under the default scope
localStorage.length;
// or
length('localStorage');

// Get the number of items under a specified scope
length('localStorage', '/path');

// Get the number of items without using any scope
length('localStorage', null);
```

## Type Definitions

```ts
export type Type = 'localStorage' | 'sessionStorage';

export type Path = string | (() => string);

export type Options = { path: Path, include?: string[],  exclude?: string[] };

declare global {
  interface Window {
    __STORAGES_DEFAULT__: Record<Type, Options>;
    __STORAGES_INIT__: Record<Type, boolean>;
  }
}
```

## License

MIT License. See the [LICENSE](LICENSE) file for more information.
