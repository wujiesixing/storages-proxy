# storages-proxy

为 `localStorage` 和 `sessionStorage` 添加作用域，避免全局污染，特别适合在微前端等项目场景中使用。

[英文文档](README.md)

## 目录

- [安装](#安装)
- [API](#api)
  - [createGlobalStorage](#createglobalstorage)
  - [updateGlobalStorage](#updateglobalstorage)
- [示例](#示例)
- [类型定义](#类型定义)
- [许可](#许可)

## 安装

使用 npm 安装：

```sh
npm install storages-proxy
```

或使用 pnpm 安装：

```sh
pnpm add storages-proxy
```

## API

### createGlobalStorage

`createGlobalStorage(type: Type, options?: Partial<Options>): void`

创建指定类型的全局存储，并设置作用域。

#### 参数

- `type` (`Type`): 存储类型，可以是 `localStorage` 或 `sessionStorage`。
- `options` (`Partial<Options>`, 可选): 存储的属性配置，包括路径。

### updateGlobalStorage

`updateGlobalStorage(type: Type, options?: Partial<Options>, force?: boolean): void`

更新指定类型的全局存储的作用域。

#### 参数

- `type` (`Type`): 存储类型，可以是 `localStorage` 或 `sessionStorage`。
- `options` (`Partial<Options>`, 可选): 存储的属性配置，包括路径。
- `force` (`boolean`, 可选): 是否重置属性配置。

## 示例

```js
import {
  length,
  createGlobalStorage,
  updateGlobalStorage,
} from 'storages-proxy';

// 创建 `默认作用域为当前路径` 的 localStorage 和 sessionStorage
createGlobalStorage('localStorage');
createGlobalStorage('localStorage', { include: [ 'key' ] });

// 创建 `默认作用域为指定路径` 的 localStorage 和 sessionStorage
createGlobalStorage('localStorage', { path: '/path' });
createGlobalStorage('localStorage', { path: '/path', include: [ 'key' ] });

// 更新 localStorage 的默认作用域为当前路径
updateGlobalStorage('localStorage');

// 更新 localStorage 的默认作用域为指定路径
updateGlobalStorage('localStorage', { path: '/new-path' });

// 设置一个键值对，使用默认作用域
localStorage.key = 'value';
// 或
localStorage.setItem('key1', 'value1');

// 设置一个键值对，使用指定作用域
localStorage.setItem('key2', 'value2', '/path');

// 设置一个键值对，不使用作用域
localStorage.setItem('key3', 'value3', null);

// 获取一个键值对，使用默认作用域
console.log(localStorage.key); // 输出 'value'
// 或
console.log(localStorage.getItem('key1')); // 输出 'value1'

// 获取一个键值对，使用指定作用域
console.log(localStorage.getItem('key2', '/path')); // 输出 'value2'

// 获取一个键值对，不使用作用域
console.log(localStorage.getItem('key3', null)); // 输出 'value3'

// 移除一个键值对，使用默认作用域
delete localStorage.key;
// 或
localStorage.removeItem('key1');

// 移除一个键值对，使用指定作用域
localStorage.removeItem('key2', '/path');

// 移除一个键值对，不使用作用域
localStorage.removeItem('key3', null);

// 获取默认作用域下第 n 个键名
localStorage.key(0);

// 获取指定作用域下第 n 个键名
localStorage.key(0, '/path');

// 获取第 n 个键名
localStorage.key(0, null);

// 清除默认作用域下的所有键值对
localStorage.clear();

// 清除指定作用域下的所有键值对
localStorage.clear('/path');

// 清除所有键值对
localStorage.clear(null);

// 获取默认作用域下的数据项数量
localStorage.length;
// 或
length('localStorage');

// 获取指定作用域下的数据项数量
length('localStorage', '/path');

// 获取数据项数量
length('localStorage', null);
```

## 类型定义

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

## 许可

MIT License. 查看 [LICENSE](LICENSE) 文件了解更多信息。
