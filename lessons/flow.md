

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
   * [Primitive types](#31-primitive-types)
   * [Mixed Types](#32-mixed-types)
   * [Function Types](#33-function-types)
   * [Object Types](#34-object-types)
   * [Union types](#35-union-types)
   * [Array Types](#36-array-types)
   * [More and more types](#3.7-more-and-more-types)   
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

In addition to static typing there is the dynamic typing.  Dynamic type checking is the process of verifying the 
type safety of a program at runtime. The majority of the type-safe languages include some form of dynamic type checking,
even if they also have a static type checker. 

Some languages are only static typing, others dynamic typing, and others both. 

### Flow's purpose

From [Flow's paper](https://dl.acm.org/citation.cfm?doid=3152284.3133872) it is possible to see its main purpose: 

> "Evolving and growing a JavaScript codebase is notoriously challenging. Developers spend a lot of time debugging silly 
mistakes — like mistyped property names, out-of-order arguments, references to missing values, checks that never fail due 
to implicit conversions, and so on — and worse, unraveling assumption and guarantees in code written by others."

In other words, Flow catches a large number of common bugs with few false positives and therefore the developers are more 
confident that their code is more robust.  

### Flow vs Typescript

Typescript is a programming language which is a superset of Javascript. Additionally, it also adds static typing. 
There is an [ongoing discussion](https://news.ycombinator.com/item?id=11844574) about which option is better (Flow or typescript). Even though that decision absolutely 
depends on the context of the project, it is fair to mention that according to [this paper](http://ttendency.cs.ucl.ac.uk/projects/type_study/documents/type_study.pdf) 
both have roughly equivalent power in their ability to detect bugs.

## 2. Getting started

Let's start by cloning the repository in your local computer. Then, checkout the branch called `babel-solution`, this will be our starting point. In order to use Flow, you will need to setup the compiler in the project and install the client which runs the checker.

### 2.1 Setup the compiler

The compiler is needed to **remove Flow types from the codebase**. It is possible to choose between `Babel` and a small CLI tool called `flow-remove-types`. 

We are going to install it via Babel.

#### 2.1.1 Install babel-preset-flow
Install [`babel-preset-flow`](https://www.npmjs.com/package/babel-preset-flow) by executing the following `yarn` command:  

```
yarn add --dev @babel/preset-flow
```

If you are using `npm` the analogous command is:

```
npm install --dev @babel/preset-flow
```

Note that we are using the [scope package](https://docs.npmjs.com/misc/scope) `@babel/preset-flow` and not the classic `babel-preset-flow`.

#### 2.1.2 Modify `.babelrc`

Go to the root of the project and open the file `.babelrc`. Inside, add Flow as a preset. The final version should look like the following file:

```
{
  "presets": ["@babel/env", "@babel/preset-flow"],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

#### 2.1.3 Compiling JS files 

Now every time we run `babel`, it will also know how to remove Flow type annotations. In order to run babel we are going to use the command defined during the first session of these workshops:

```
yarn babel
```

### 2.2 Setup Flow client

In order to run the flow type validation we need to setup the Flow client.

#### 2.2.1 Install flow-bin

Install [flow-bin](https://www.npmjs.com/package/flow-bin) by running the following command using yarn:

```
yarn add --dev flow-bin
```

If you are using npm run the following command:

```
npm install --dev flow-bin
```

#### 2.2.2 Run the Flow checker

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

### 2.3 Prepare your files for Flow 

In order to tell the compiler which file it should check, you need to mark it as a Flow file by placing the following line at the top of the file:

```js
// @flow
```

Then the compiler will analyse all these files at compile time to ensure consistency across the type definitions. 

## 3. Writing Flow code

### 3.1 [Primitive types](https://flow.org/en/docs/types/primitives/)

#### 3.1.1 Literal vs. wrapper types

In Flow there are types for the literal values that are lowercase, and types for the wrapper objects which are 
capitalized. Therefore, the type `Number` is not the same as the type `number`. The full list of primitive types is:

* [`Booleans`](https://flow.org/en/docs/types/primitives/#toc-booleans)
* [`Number`](https://flow.org/en/docs/types/primitives/#toc-numbers)
* [`String`](https://flow.org/en/docs/types/primitives/#toc-strings)

#### 3.1.2 [`null` vs. `void`](https://flow.org/en/docs/types/primitives/#toc-null-and-void)

The type of `null` is `null` but the type of `undefined` is `void`. Therefore, a function which input is a number and 
returns `undefined`, its type will be `(number) => void`.

#### 3.1.3 [Maybe types](https://flow.org/en/docs/types/primitives/#toc-maybe-types)

In order to define a maybe type, you need put a `?` before the type. In this way, the type defined, `void` and `null` 
will be accepted.

For example: 
```flow js
function foo (x: ?number) {
  //....
}

```
It will accept any number, `null` or `undefined` as its input. 

#### 3.1.4 Optional [object parameters](https://flow.org/en/docs/types/primitives/#toc-optional-object-properties) and [function parameters](https://flow.org/en/docs/types/primitives/#toc-optional-function-parameters)

It is possible to declare a object property of a function argument by placing the `?` right after the variable name.

```flow js
function foo(value?: string) {
  // ...
}
``` 

`value` can be any sting and `undefined` but **not `null`**.

### 3.2 [Mixed types](https://flow.org/en/docs/types/mixed/)

In Flow we use Mixed types to indicates that a certain variable or argument can accept any kind of type. If you would like
to interact with a variable which is `mixed` you need to ensure first that certain variable has a defined type.


```flow js
function stringify(value: mixed) {
  if (typeof value === 'string') {
    return "" + value; // Works!
  } else {
    return "";
  }
}
```

> Warning: Do not confused Mixed types with [`Any`](https://flow.org/en/docs/types/any/). **You should not use `Any`.** 

### 3.3 [Function types](https://flow.org/en/docs/types/functions/)

#### 3.3.1 [Return type of a function](https://flow.org/en/docs/types/functions/#toc-function-returns)

We can add the return type of a function, by typing after the list of arguments.
```flow js
function foo(bar: string): number {
  return 5;
}
```

```flow js
const method = (bar: string):number => {
  return 5;
}
```

#### 3.3.2 [Rest parameters](https://flow.org/en/docs/types/functions/#toc-rest-parameters)

It is possible to type the rest parameters sintax as an `Array`.

```flow js
function method(...args: Array<number>) {
  // ...
}
```

####  3.3.3 [Arbitraty functions](https://flow.org/en/docs/types/functions/#toc-function-type)
In the case you would like to express an arbitrary function, you should write `() => mixed`.

> Warning: Do not use the `Function` type. Use `()=> mixed` instead. 


#### 3.4 [Object Types](https://flow.org/en/docs/types/objects/)

It is possible to define types for objects by defining the type of each of their fields:

For example: 

```flow js
var obj: {
  foo: number,
  bar: boolean,
  baz: string,
} = {
  foo: 1,
  bar: true,
  baz: 'three',
};
```

In flow, it is considered safe to pass extra properties to a certain object of a certain type. Therefore,
the following definition will work:

```flow js
var obj: {
  foo: number,
  bar: boolean,
} = {
  foo: 1,
  bar: true,
  baz: 'three',
};
```

If we want to Exact match a object tyoe definition, we need to wrap the definition with `|`.

```flow js
var obj: {|
  foo: number,
  bar: boolean,
|} = {
  foo: 1,
  bar: true,
  baz: 'three',
};
```

Flow will consider the definition above unsafe and it will fail in compile time.
 

Read more about objects in the [flow docs](https://flow.org/en/docs/types/objects/).


#### 3.5 [Union Types](https://flow.org/en/docs/types/unions/)

Union types allow us to create a type which is one of a set of other types or constants. The definition 

```flow js
type Foo =
  | Type1
  | Type2
  | ...
  | TypeN
```
#### 3.6 [Array Types](https://flow.org/en/docs/types/arrays/)

In order to create an array type it is possible to use `Array<Type>` type where `Type` is the type of elements in the array. 
For example, to create a type for an array of numbers you use `Array<number>`.

```flow js
let arr: Array<number> = [1, 2, 3];
``` 

Flow, additionally defines a shorthand for this type definition:

```flow js
let arr: number[] = [1, 2, 3];
```

Read more about Array access in the [flow's documentation](https://flow.org/en/docs/types/arrays/#toc-array-access-is-unsafe). 

#### 3.7 More and more types

Above we covered a sub-set of Flow's types but there are many more: [Tuples](https://flow.org/en/docs/types/tuples/), 
[classes](https://flow.org/en/docs/types/classes/), [generics](https://flow.org/en/docs/types/generics/), 
[intersections](https://flow.org/en/docs/types/intersections/), the extremely useful [utility types](https://flow.org/en/docs/types/utilities/),
etc. 


## 4. Where do we use it at The Guardian?
* [frontend](https://github.com/guardian/frontend)
* [support-frontend](https://github.com/guardian/support-frontend)

## 5. Resources
* [Static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking)
* [Flow website](https://flow.org/)
* [Flow cheat sheet](https://www.saltycrane.com/flow-type-cheat-sheet/latest/)
* [Fast and Precise Type Checking for JavaScript (Flow paper)](http://delivery.acm.org/10.1145/3140000/3133872/oopsla17-oopsla179.pdf?ip=86.163.232.185&id=3133872&acc=OA&key=4D4702B0C3E38B35%2E4D4702B0C3E38B35%2E4D4702B0C3E38B35%2EC1E31BC46E58D5B8&__acm__=1518982362_28510adef31f2c5ca06e91476f4d1e96)
* [To Type or Not to Type: Quantifying Detectable Bugs in JavaScript (Paper comparing Typescript and Flow)](http://ttendency.cs.ucl.ac.uk/projects/type_study/documents/type_study.pdf)


