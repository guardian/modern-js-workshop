# ModernJS - Babel
## Welcome to Modern JS
[Intro to the 4 weeks]

## Babel
In this lesson we'll be learning about Babel which allows us to write modern javascript without worrying about it!

We'll go through briefly what Babel does, why we use it and how to set it up in a project.

When opening the project and looking around, if you haven't looked at JS for a while there may be some newer syntax you don't understand. It's not just you; some older browsers won't understand this either, which is why we want Babel.
### What is Babel?
- It is a [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler), converting Javascript to Javascript

### Why do we want this
- Javascript has many different runtimes
  - V8 (Chrome)
  - Chakra (IE >= 9)
  - Spidermonkey (Firefox)
  - JavaScriptCore (Safari)
  - JScript (IE < 9)
- Some of the newer language features are unsupported in many of the currently used browsers
- We want to be able to use modern features that make Javascript easier (and more fun) to develop in
- Almost every browser that hits the Guardian supports the 'ES5' spec, Babel converts features from later specs back to ES5

### What features does Babel handle?
- Many of the improvements in the newer specs are syntatic sugar, which make transpilation relatively easy (default parameters, implicit returns)
```js
// ES2015
const myFunc = (a = 1) => a + 2;

// ES5 equivalent
function myFunc(a) {
  a = typeof a === "undefined" ? 1 : a;
  return a + 2;
}
```
- Some of the language features are new native APIs that are implementable (albeit less efficiently) in ES5 javascript and require a polyfill (e.g. `async / await`), this isn't handled by Babel transpilation! (theguardian.com currently uses [polyfill.io](https://polyfill.io))
- Some are not possible to completely polyfill (e.g. extending a built in class isn't possible in ES5) so they approximate functionality but may not work in all cases.

## The project
We can test out the project now by running `yarn start` inside the project folder and navigating to the URL shown in the output. This will probably work fine in Chrome and Firefox but in Safari (at time of writing) it will have trouble with some of the syntax.

## Getting Babel into a project
This is the process to follow to get Babel into our project:
- Install babel and its CLI tool into the project
- Configure babel: tell it what syntax we want to transform
- Run babel on our code
- Add in a polyfill for any missing APIs (babel doesn't handle these)

### Installing Babel
The Babel docs have pretty comprehensive info on this but it can sometimes be a lot to get your head around for the first time.

- So first let's install babel into our project using our package manager
  - We're using `yarn` so we need to run `yarn add --dev @babel/core @babel/cli` (for `npm i --save-dev @babel/core @babel/cli`)
    - `@babel/cli`, as the name suggests, gives us a command line interface to use babel
    - `@babel/core` is the main babel code and `@babel/cli` will complain if we don't have it installed
  - This will add both of those packages to our `node_modules` folder

### Configuring Babel
- We now have babel installed but we need to tell it the syntax we're using that we want to transpile
- Babel transpiles *nothing* by default but instead uses plugins, we tell babel what to transpile by installing and specifying those plugins.
- Babel, like a lot of javascript tooling, uses an "rc file" in the project root - by default this is `.babelrc` - for setting configuation
  - You can pass arguments to babel through the command line, or the Node API but having them specified in an rc file, project-wide means less repetition if you have other libraries in your project that use babel and you want the same setup (e.g. `babel-jest` or `webpack`)
- For now we'll just need a file that tells babel what plugins we're using in a json format - the biggest use case for a `.babelrc` file
```json
{
  "presets": [
    [
      "@babel/env",
      {
        "debug": true,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "IE >= 9"]
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-proposal-object-rest-spread"]
}
```
- Before this will work we actually need to install those plugins with `yarn add --dev @babel/preset-env @babel/plugin-proposal-object-rest-spread`

#### Aside: Presets and plugins
"Presets" are just a packaged list of "plugins"

##### Object rest spread
Very useful and is now stage-4 although not moved to stage 4 in babel so we've added it here as a good example of a plugin

##### Preset env
Preset env is a "special" preset that contains all "stage-4" proposals from the TC39 committee - the committee that decides on the ECMA spec (the one that Javascript follows)

- stage-0 - Strawman
- stage-1 - Proposal (has a champion)
- stage-2 - Draft
- stage-3 - Candidate
- stage-4 - Finished (will be added to the spec, waiting to be implemented in runtimes)

Also you can see we're specifying `targets.browsers` in the options. This uses [browser list](https://github.com/ai/browserslist#queries) for the queries and [compat-table](https://github.com/kangax/compat-table) to cross reference the ES features supported by those browsers and transforms accordingly!

### Running Babel
Installing `babel-cli` gave us a file in `node_modules/.bin` called `babel` that acts as the babel CLI (this pattern is nice as node can install all binary dependencies without relying on the environment to provide them). We can call this file `$(yarn bin)/babel` (`$(yarn bin)` gives us the absolute path to this bin file - try typing `yarn bin` into the command line). We only need to specify two things:
- A directory (or file) to run it on (the first command line argument)
- An output destination - specfied with the `-d` (for a directory) or `-o` (for file) flag.

All of these things together mean we can run `mkdir -p dist && $(yarn bin)/babel src -d dist`.

### Yarn / npm scripts
To save us typing this each time we can instead add a `script` inside our package.json like so (these scripts automatically get `node_modules/.bin` added to their `$PATH` so we can remove `$(yarn bin)/`:

```js
  {
    //...
    "scripts": {
      "babel": "mkdir -p dist && babel src -d dist"
    }
    // ...
  }
```

We now just need to change our `index.html` file to load these `dist` files rather than our `src` files. If you load the browser then hopefully nothing should have changed!

### Polyfilling
Finally, even though we probably won't see any errors (even in Safari), as mentioned above we will need to polyfill missing functions from later browsers.

If you look in `dist/services/CAPI.js` you'll see references to `regeneratorRuntime` which babel needs to support `async / await` in older browsers. As mentioned earlier this requires polyfilling.

There are plenty of complex ways to load polyfills so that you don't load more than a browser needs (polyfill.io, import while bundling `useBuiltIns`) but for now we'll just load the whole polyfill from a CDN and drop it in. At the time of writing we're using the v7 beta 3 version of the [polyfill](https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0-beta.3/polyfill.min.js) in line with the babel version we're using. (Aside: Everything under babel's [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) moves forward with the same version number thanks to [lerna](https://lernajs.io/))

## We're done!
This is the simplest way to get modern javascript running in most of the environments.

## Caveats
Babel plugins can potentially turn *anything* to JS. And there are a lot of plugins that do. While it may be tempting to bring some into your project it's probably best to stick to `env` and the `stage-4` code for Guardian projects. Ultimately you want any JS developer to be able to touch your codebase, and the further you get away from standards javascript the harder it will be for most people to touch!

# Extensions
## How does Babel work?
- Babel converts Javascript to an AST using the Babylon parser
- Each plugin is required to implement the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)
- The spec for the current supported AST nodes is [here](https://github.com/babel/babylon/blob/master/ast/spec.md)
- If we define a plugin for anyone of those nodes it will be run on that node, will receive that node as a parameter to the method
- The plugin also gets an instance of `babel-types` which is a helper for *creating* AST nodes. These can be used with methods on the node like `path.replaceWith(types.stringLiteral("Guardian"))`

# References
- [REPL](https://babeljs.io/repl/)
- [Babel ES2015](https://babeljs.io/learn-es2015/) - docs on the transforms for the ES2015 spec (slightly outdated but a good guide)
- [Babel polyfill](https://babeljs.io/docs/usage/polyfill/) - docs on what the polyfill covers and how it crosses over with Babel
- [TC39 Github](https://github.com/tc39/proposals) - list of all the current proposals for the language
- [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)
