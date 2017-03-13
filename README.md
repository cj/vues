<h1 align="center">Vues <img src='https://raw.githubusercontent.com/xpepermint/vue-webpack/master/logo.png' height='20px' /></h1>

<p style='color: #A61717;' align="center">🚧 <i><b>Under active development.  Feedback is welcome.</b></i> 🚧</p>

<p align="center">
  <a href="https://travis-ci.org/cj/vues"><img src="https://img.shields.io/travis/cj/vues/master.svg" alt="Build Status" target="_blank"></a>
  <a href="https://coveralls.io/github/cj/vues?branch=master"><img src="https://img.shields.io/coveralls/cj/vues/master.svg" alt="Coverage Status" target="_blank"></a>
  <a href="https://www.npmjs.com/package/vues"><img src="https://img.shields.io/npm/dt/vues.svg" alt="Downloads" target="_blank"></a>
  <a href="https://gitter.im/cj/vues"><img src="https://img.shields.io/badge/GITTER-join%20chat-green.svg" alt="Gitter" target="_blank"></a>
  <a href="https://github.com/cj/vues/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/vues.svg" alt="License" target="_blank"></a>
</p>

> The quickest way to run [vuejs] client side (inspired by [next.js], [nuxt.js] and  [vbuild]).

## Introduction

## Quickstart

```
$ yarn global add vues
$ vues init project
$ cd project
$ yarn dev
```
Done!!!  You're now running [vuejs].

## Folder Structure

```javascript
projectDir/
|
|-- filters/
|
|-- layouts/
|
|-- stores/
|
|-- views/
```

<details>
<summary>
  <a href='#folder__filters'><b>filters</b></a>
  <p>Global <a href='https://vuejs.org/'>vuejs</a> filters.</p>
</summary>
</details>

<details>
<summary>
  <a href='#folder__layouts'><b>layouts</b></a>
  <p>Wrap your views with layout.</p>
</summary>
</details>

<details>
<summary>
  <a href='#folder__stores'><b>stores</b></a>
  <p>Vuex namespaced stores.</p>
</summary>
</details>

<details>
<summary>
  <a href='#folder__views'><b>views</b></a>
  <p>Application views.</p>
</summary>
</details>

## vues.config.js (click to toggle)

<details>
<summary>
  <a href='#config__title'><b>title</b></a>
  <p>Set the title for your application.</p>
</summary>

```javascript
{
  title: 'My App'
}
```
</details>

<details>
<summary>
  <a href='#config__title-template'><b>titleTemplate</b></a>
  <p>Sets the title dynamically based on the title option in your /views vue component.</p>
</summary>

`{{ title }}` will be replaced by the title in your `vues.config.js` and `{{ viewTitle }}` will be replaced by the `title` option in your `/views` `.vue` file.

```javascript
{
  titleTemplate: '{{ title }} | {{ viewTitle }}'
}
```
</details>

<details>
<summary>
  <a href='#config_src-dir'><b>srcDir</b></a>
  <p>Specify the vues root folder.  This is the project root by default.</p>
</summary>

```javascript
import { resolve } from 'path'

{
  srcDir: resolve('./src')
}
```
</details>

<details>
<summary>
  <a href='#config__include'><b>include</b></a>
  <p>Files/folders to be compiled with babel-loader.</p>
</summary>

Some node modules may require the need to be processed by `babel-loader`.

```javascript
{
  include: ['some-node-module']
}
```
</details>

<details>
<summary>
  <a href='#config__envs'><b>envs</b></a>
  <p>Compile selected process.env variables with webpack.</p>
</summary>

Vues will load environment variables from `.env` and `.env.[process.env.NODE_ENV]` files.  If you want access to them via `process.env` inside your [vuejs] project just and them to your envs array.

```javascript
{
  envs: ['PUBLIC_KEY']
}
```

You will now have access to `process.env.PUBLIC_KEY` inside your [vuejs] project.
</details>

<details>
<summary>
  <a href='#config__router'><b>router</b></a>
  <p>Customize the vue-router.</p>
</summary>

You can completely customize [vue-router] using any of the options available at https://router.vuejs.org/en/.  If you make the router option a function, you will be able to access the context of the router file.

```javascript
{
  router () {
    return {
      history: null, // cordova can't handle html5 browser history
      routes: [
        { name: 'index', path: '/', component: require('~/views/login') },
        // You have access to LoginView due to this being executed in the context of the router file.
        { name: 'logout', path: '/logout', component: LoginView }
      ],
      // You even have the option to use the routers beforeEach method.
      beforeEach (to, from, next) {
        // some code
      }
    }
  }
}
```
</details>

<details>
<summary>
  <a href='#config__store'><b>store</b></a>
  <p>Customize the vuex store.</p>
</summary>

Just like the [router] you can use this to completely customize [vuex].  It may also be turned into a function, which will the get executed in the context of the `store.js` file.

```javascript
{
  store: {
    plugins: [require('vuex-persistedstate')]
  }
}
```
</details>

<details>
<summary>
  <a href='#config__polyfills'><b>polyfills</b></a>
  <p>Add selected polyfills to support older browsers.</p>
</summary>

We use [core-js] under the hood, the following are used by default:

```javascript
{
  polyfills: ['promise', 'array/includes', 'string/includes', 'object/entries']
}
```
</details>

<details>
<summary>
  <a href='#config__babel'><b>babel</b></a>
  <p>Customize your applications babel config.</p>
</summary>

Default babel config used:

```javascript
{
  babel: {
    presets: ['vue-app']
  }
}
```
</details>

<details>
<summary>
  <a href='#config__meta'><b>meta</b></a>
  <p>Inject meta tags into your index.html.</p>
</summary>

```javascript
{
  meta: [
    { name: 'mobile-web-app-capable', content: 'yes' }
  ]
}
```
</details>

[vuejs]: https://vuejs.org/
[vue-router]: https://router.vuejs.org/en/
[vuex]: https://vuex.vuejs.org/en/

[nuxt.js]: https://github.com/nuxt/nuxt.js
[next.js]: https://github.com/zeit/next.js
[vbuild]: https://github.com/egoist/vbuild
[core-js]: https://github.com/zloirock/core-js/

[router]: #config__router
