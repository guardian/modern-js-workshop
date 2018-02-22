

# Modern JS workshop - Flow

## Table of contents
1. [Introduction](#1-introduction)
    * [What is Flow?](#what-is-flow)
    * [Flow's purpose](#flows-purpose)
    * [Flow vs Typescript](#flow-vs-typescript)
2. [Getting started](#2-getting-started)
   * [Setup the compiler](#setup-the-compiler)
   * [Setup Flow client](#setup-flow-client)
   * [Prepare your files for Flow](#prepare-your-files-for-flow) 
3. [Writing Flow code](#3-writing-flow-code)
4. [Where do we use it at The Guardian?](#4-where-do-we-use-it-at-the-guardian)
5. [Resources](#5-resources)


## 1. Introduction

### What is Flow?
According to [Flow's site](https://flow.org/):

> "Flow is a static type checker for javascript."

Informally it is possible to say that static type checking is the process of verifying the type safety of a program 
based on analysis of a program's sourcecode. If a program passes a static type checker, then the program is guaranteed 
to satisfy some set of type safety properties for all possible inputs.[[1](https://en.wikipedia.org/wiki/Type_system#Static_type_checking)]
This process usually runs at compile time.

The alternative to state type checking is dynamic type checking. Dynamic type checking is the process of verifying the 
type safety of a program at runtime. The majority of the type-safe languages include some form of dynamic type checking,
even if they also have a static type checker. 

### Flow's purpose

From [Flow's paper](https://dl.acm.org/citation.cfm?doid=3152284.3133872) it is possible to see its main purpose: 

> "Evolving and growing a JavaScript codebase is notoriously challenging. Developers spend a lot of time debugging silly 
mistakes — like mistyped property names, out-of-order arguments, references to missing values, checks that never fail due 
to implicit conversions, and so on — and worse, unraveling assumption and guarantees in code written by others."

In other words, Flow catch a large number of common bugs with few false positives and therefore the developers are more 
confident that their code is more robust.  

### Flow vs Typescript

Typescript is a programming language which is a superset of Javascript. Additionally, it also adds static typing. 
There is an [ongoing discussion](https://news.ycombinator.com/item?id=11844574) about which option is better (Flow or typescript). Even though that decision absolutely 
depends on the context of the project, it is fair to mention that according to [this paper](http://ttendency.cs.ucl.ac.uk/projects/type_study/documents/type_study.pdf) 
both have roughly equivalent power in their ability to detect bugs.

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

Then the compiler will analyse all these files at compile time to ensure consistency across the type definitions. 

## 3. Writing Flow code

## 4. Where do we use it at The Guardian?
* [frontend](https://github.com/guardian/frontend)
* [support-frontend](https://github.com/guardian/support-frontend)

## 5. Resources
* [Static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking)
* [Flow website](https://flow.org/)
* [Flow cheat sheet](https://www.saltycrane.com/flow-type-cheat-sheet/latest/)
* [Fast and Precise Type Checking for JavaScript (Flow paper)](http://delivery.acm.org/10.1145/3140000/3133872/oopsla17-oopsla179.pdf?ip=86.163.232.185&id=3133872&acc=OA&key=4D4702B0C3E38B35%2E4D4702B0C3E38B35%2E4D4702B0C3E38B35%2EC1E31BC46E58D5B8&__acm__=1518982362_28510adef31f2c5ca06e91476f4d1e96)
* [To Type or Not to Type: Quantifying Detectable Bugs in JavaScript (Paper comparing Typescript and Flow)](http://ttendency.cs.ucl.ac.uk/projects/type_study/documents/type_study.pdf)


