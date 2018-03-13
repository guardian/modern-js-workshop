# Modern JS workshop - Webpack 

[![docs](https://img.shields.io/badge/webpack-docs-green.svg?link?https://webpack.js.org&colorB=1D78C1&longCache=true)](https://webpack.js.org/)

### Table of contents

1.  [What is Webpack?](#1-what-is-webpack)
2.  [Why would we use it?](#2-why-would-we-use-it)
3.  [Getting going](#3-getting-going)
    1.   [Installing Webpack](#installing-webpack)
    2.   [Bundling the code](#bundling-the-code)
    3.   [Using the bundle](#using-the-bundle)
    4.   [Using ES modules](#using-es-modules)
    5.   [Adding Babel (again)](#adding-babel-again)
    6.   [Further optimising Babel](#further-optimising-babel)
4.  [Next steps](#4-next-steps)

## 1. What is Webpack?

Webpack is a javascript bundler, normally used to bundle client-side applications into static assets, ready for production use in a browser.

The most common scenario is to bundle up a JS app, though Webpack's enormous configurability means it is not limited to that.

You can use it to bundle Sass, SVGs, Rust – even WASM – to JS, and much more. You can also output libraries ready to publish on NPM or as server side apps ready to run in Node.

## 2. Why would we use it?

Our application currently consists of 5 separate files: 4 source files plus some polyfills. Why is this bad?

*   **brittle** The only way they can communicate with each other is by adding to the browser's global scope – anything else could write to the same variable name and break our app.

*   **slow** Under HTTP/1.1, requesting each of these is expensive. Under H2, this is less of an issue, but we still need all 5 requests to all succeed before we can run.

*   **bloated** We have duplicated code, because we cannot express dependencies between the files/modules and remove things we don't need, or have multiples of.

We could run `yarn babel` and concatenate the files in `app/dist`, maybe wrapping them in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) – this would reduce the number of files we need to download and deal with scope, but it doesn't help with duplication and re-use.

Webpack allows us to use [ES module syntax](http://2ality.com/2014/09/es6-modules-final.html) to express dependency, bundle up the source with all it's dependencies, and even discard code that our app doesn't actually run.

It also offers Loaders, which allow us to transform files as Webpack encounters them.

In our case, we can use the `babel-loader`, so we'll be able to forget about running Babel manually – we just have to tell Webpack what to do.

## 3. Getting going

### Installing Webpack

First things first, we need `webpack`:

```bash
# yarn
yarn add --dev webpack webpack-cli

#npm
npm i -D webpack webpack-cli # we'll use yarn from now on
```

This installs webpack itself, and gives us a binary we can run from the CLI like `babel`, `flow` and `jest`: `webpack` (unsurprisingly).

To make life easier, let's follow convention and add a script to `package.json`, so that we'll invoke the local copy we've just installed:

```js
...
    "scripts": {
        ...,
        "build": "webpack"
    },
...
```

### Bundling the code

Now we can run it:

```bash
yarn build
```

Without any configuration, Wepack assumes the way in to our app will be a file called `index.js` in a directory called `src`.

It's correct!

It will also assume we are bundling for the browser, in production, and apply a set of suitable optimisations: minification, scope hoisting, tree-shaking etc. 

Correct!

However, it will also warn us if we aren't explicit, so let's be:

```js
...
    "scripts": {
        ...,
        "build": "webpack --mode production"
    },
...
```

By default, it will write the bundle to `dist/main.js`.

Like everything in Webpack, this is configurable, but the default is fine.

### Using the bundle

Now we need to load _this_ file in the index page, not the others. We'll leave the polyfill for the moment – the `<body>` should now look something like this:

```html
<!-- index.html -->
...
<body>
  <div id="app"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0-beta.3/polyfill.min.js"></script>
  <script src="./dist/main.js"></script>
</body>
...
```

If we start the server and hit the index page, we can see that nothing is happening and we have an error in the console, something like `GuDOM is not defined`.

If we look `app/src/index.js`, we can see why.

Previously, we were loading `app/src/lib/GuDOM.js` and the `GuDOM` variable it creates was added to the global scope, so `index.js` found it – but we've just removed `app/src/lib/GuDOM.js`.

### Using ES modules

We need convert our source files into modules that `import` and `export` their contents so that Webpack can trace the dependency tree and include the necessary code in the bundle.

Here's an example of how `index.js` can import `GuDOM` from `lib/GuDOM`:

```js
// index.js
import GuDOM from './lib/GuDom';
import { CAPI } from './services/CAPI';
...
```

```js
// lib/GuDom.js
...
export default GuDOM;
```

If we run `yarn build` again, we can see Webpack has included each file:

```bash
   [0] ./src/index.js + 3 modules 4.8 KiB {0} [built]
       | ./src/index.js 1.54 KiB [built]
       | ./src/lib/GuDom.js 2.59 KiB [built]
       | ./src/services/CAPI.js 480 bytes [built]
       | ./src/utils/GuUtils.js 197 bytes [built]
```

### Adding Babel (again)

If you look at `dist/main.js`, you can see it's an unreadable mess, but you should be able to pick out recognisable bits.

Some of those are bits of ES6/7 code that previously Babel was transpiling to ES5 for us.

This is because we're not using the transpiled code now: Webpack works with our original source files.

We need to tell Webpack to use Babel on our code before bundling it, by using a [loader](https://webpack.js.org/concepts/#loaders) – in this case `babel-loader` – for our JS.

> Webpack only understands JS. Loaders are scripts that Webpack will pass the file it's 'loading' to, and use whatever is returned as if it was the original file. For example, the `sass-loader` compiles Sass to CSS, then passes the compiled CSS back to Webpack as a valid Javascript ES module which exports that CSS.

To configure a loader, we need a `webpack.config.js` file, similar to the `.babelrc`.

This should be a Node (commonjs) module that exports an object of config options.

> It's worth mentioning that Webpack have done a lot of work in version 4 to reduce the amount of config you need, but config files can _still_ be bewildering places – pre-version 4 ones almost definitely will be. Webpack is extremely powerful, option names are not the clearest and they can get unwieldy pretty quickly. If you find them confusing, don't worry too much – welcome to the club!

Let's install the `babel-loader` and add it to the config:

```bash
$ yarn add --dev babel-loader
```

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/, // regex to test the file's path against
                use: 'babel-loader',
            },
        ],
    },
};
```

Now if we build, Webpack will detect the presence of a config file and pass any `*.js` file it meets as it bundles to Babel. Babel in turn will find our `.babelrc` and take it's cues from that:

```bash
yarn build
```

You can see that `dist/main.js` is now a bit bigger 😞 but has no ES6 in it 😀.

> You will probably want to `exclude: /node_modules/` in the rule config too, in reality. Most (_most_) npm modules don't need transpiling and slows down compilation a lot. 

Now that Webpack is invoking Babel for us, we can remove the Babel script from `package.json`:

```js
"scripts": {
    "start": "http-server",
    "test": "jest ./src --verbose",
    "build": "webpack --mode production"
},
```

### Further optimising Babel

We have a couple of housekeeping tasks left to improve how Babel transforms our code, now that we're writing ES modules and using Webpack.

Since Webpack can only treeshake ES module `export`s, we need to tell Babel not to convert our ES6 modules to commonjs, the default for `@babel/preset-env`:

```js
[
    "@babel/env",
    {
        "debug": true,
        "targets": {
            "browsers": ["> 1%", "last 2 versions", "IE >= 9"]
        },
        "modules": false // ✨
    }
]
```

We can also copy the `useBuiltIns` setting from the `test` env to automatically bundle polyfills that Babel discovers we need:

```js
[
    "@babel/env",
    {
        "debug": true,
        "targets": {
            "browsers": ["> 1%", "last 2 versions", "IE >= 9"]
        },
        "modules": false,
        "useBuiltIns": "usage" // ✨
    }
]
```

Running `yarn build` now, Babel will output which polyfills we _might_ have needed, and then which we _did_ need, given the browsers we're targetting.

We can also see that Webpack has added quite a few more modules to our bundle (`+ 89 hidden modules`) and the file size has jumped from `4.89kB` to `37.5bK` (uncompressed).

This seems a lot, but the polyfill library we're currently also including is `100kB` (uncompressed). It includes _everything we could polyfill_, while our bundle includes only what we need.

Let's remove it, now we're including all our own polyfills:

```html
<!-- index.html -->
<body>
  <div id="app"></div>
  <script src="./dist/main.js"></script>
</body>
```

Done! 🧠

## 4. Next steps

This really only scrapes the surface of what you can do with Webpack. In this app, for example, we could [import the CSS into our app, and have Webpack automatically inject it when the app starts](https://medium.com/a-beginners-guide-for-webpack-2/webpack-loaders-css-and-sass-2cc0079b5b3a).

The Webpack team are working very hard to make onboarding easier. https://webpack.js.org has the full api and concepts, and one of the core maintainers, Sean Larkin [@TheLarkInn](https://twitter.com/thelarkinn) is _very_ active on twitter, and very responsive to confused would-be Webpackers.
