

# Modern JS workshop - Flow

## Table of contents
1. [What is Flow?](#1-what-is-flow)
2. [Getting started](#2-getting-started)
   * [Setup the compiler](#setup-the-compiler)
   * [Setup Flow client](#setup-flow-client)
   * [Prepare your files for Flow](#prepare-your-files-for-flow) 
3. [Writing Flow code](#3-writing-flow-code)
4. [Where do we use it at The Guardian?](#4-where-do-we-use-it-at-the-guardian)
5. [Resources](#5-resources)


## 1. What is Flow?

According to Flow's site:

> Flow is a static type checker for javascript


<! -- What does Flow give us? -->

## 2. Getting started

Let's start by cloning the repository in your local computer. Then, checkout the branch called `babel-solution`, this will be our starting point. In order to use Flow, you will need to setup the compiler in the project and install the client which runs the checker.

### Setup the compiler

The compiler is needed to **remove Flow types from the codebase**. It is possible to choose between `Babel` and a small CLI tool called `flow-remove-types`. 

We are going to install it via Babel.

#### 1. Install babel-preset-flow
Install [`babel-preset-flow`](https://www.npmjs.com/package/babel-preset-flow) by executing the following `yarn` command:  

```
yarn add --dev @babel/preset-flow
```

If you are using `npm` the analogous command is:

```
npm install --dev @babel/preset-flow
```

Note that we are using the [scope package](https://docs.npmjs.com/misc/scope) `@babel/preset-flow` and not the classic `babel-preset-flow`.

#### 2. Modify `.babelrc`

Go to the root of the project and open the file `.babelrc`. Inside, add Flow as a preset. The final version should look like the following file:

```
{
  "presets": ["@babel/env", "@babel/preset-flow"],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

#### 3. Compiling JS files 

Now every time we run `babel`, it will also know how to remove Flow type annotations. In order to run babel we are going to use the command defined during the first session of these workshops:

```
yarn babel
```

### Setup Flow client

In order to run the flow type validation we need to setup the Flow client.

#### 1. Install flow-bin

Install [flow-bin](https://www.npmjs.com/package/flow-bin) by running the following command using yarn:

```
yarn add --dev flow-bin
```

If you are using npm run the following command:

```
npm install --dev flow-bin
```

#### 2. Run the Flow checker

The first time we need initialise Flow by running:

```
yarn run flow init
```
The command above will create a `.flowconfig` in the root of the project. If you would like to know more about which kind of configuration you can specify, please [read the docs](https://flow.org/en/docs/config/).

Now we can run the Flow Background Process:

```
yarn flow
```

The output of this command should look like the following:

```
yarn run v1.2.1
$ /.../modern-js-workshop/node_modules/.bin/flow
No errors!
✨  Done in 0.23s.
```

Congratulations, you are ready to develop using Flow 🚀.

### Prepare your files for Flow 

In order to tell the compiler which file it should check, you need to mark it as a Flow file by placing the following line at the top of the file:

```js
// @flow
```

Then the compiler will analise all these files at compile time to ensure consistency across the type definitions. 

## 3. Writing Flow code

## 4. Where do we use it at The Guardian?
* [frontend](https://github.com/guardian/frontend)
* [support-frontend](https://github.com/guardian/support-frontend)

## 5. Resources
* [Flow website](https://flow.org/)
* [Flow cheat sheet](https://www.saltycrane.com/flow-type-cheat-sheet/latest/)
* [Fast and Precise Type Checking for JavaScript (Flow paper)](http://delivery.acm.org/10.1145/3140000/3133872/oopsla17-oopsla179.pdf?ip=86.163.232.185&id=3133872&acc=OA&key=4D4702B0C3E38B35%2E4D4702B0C3E38B35%2E4D4702B0C3E38B35%2EC1E31BC46E58D5B8&__acm__=1518982362_28510adef31f2c5ca06e91476f4d1e96)


