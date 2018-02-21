# ModernJS - Jest
## Welcome to Modern JS

## Jest
In this lesson we'll be learning about [Jest](https://facebook.github.io/jest) which is an easy and powerful tool for testing your javascript projects.

### What is Jest?
It is a unit testing framework, creating with the idea of being a "zero configuration" testing experience.
We'll spend less time setting up test runners, assertion libraries, mocking tools and more time writing tests, leading to more stable and healthy code bases. 

### Features
- Automatically generating snapshots for snapshot testing
- Running tests in parallel, meaning it's super performant
- Sandboxing tests and automatically tearing down global state so you don't have to worry about conflicts
- Code coverage reports
- Built-in mocking and assertions

## Installing Jest
Jest is available on npm.

```
// yarn
yarn add --dev jest

// npm
npm i --save-dev jest
```

### Using Jest with babel
Jest runs on Node and as a result, if you're using ES2016+ you'll need to transpile your code. A nice side effect of this is that we can also write our tests in ES2016+ too.

*Caveat* - The version of babel from the first lesson is a beta version of babel 7. Jest is not yet compatible with this, so we'll need to include `babel-core@^7.0.0-0` and  `regenerator-runtime` to get the same behaviour in the testing enviroment.

Get the compatible version of `babel-core` and `regenerator-runtime`
```
// yarn
yarn add --dev babel-core@^7.0.0-0 regenerator-runtime

// npm
npm i --save-dev babel-core@^7.0.0-0 regenerator-runtime
```

### Configuring Jest
Out of the box, running Jest will search your project for `<filename>.test.js` and run them against `<filename>.js`. This is great but sometimes we'll need more.
Jest can be configured either in your `package.json` or inside its own file. This is called `jest.config.js` by default but can also be defined using the `--config` option.

A list of available options can be found in the [docs](https://facebook.github.io/jest/docs/en/configuration.html#verbose-boolean). For this lesson, we'll be using the standard setup.

## Writing tests
Jest uses a Jasime-like API, but comes with its own assertions and mocking libraries. Here's a quick example.

```
// add.js
const add = (a, b) => a + b;


// add.test.js
import add from './add';

test('adds 1 and 2 to equal 3', () => {
    expect(add(1, 2).toBe(3));
});
```

## Running Jest
To run jest, we can just add the `jest` command to our `scripts` in `package.json`, just like we did with babel:

```
{
    scripts: {
        test: jest
    }
}
```

Then simply run `yarn test`. You'll see jest start up, transpile the js using babel, automatically find all of the tests and run them against your code.


## Bonus: Snapshot testing
Jest provides automated [snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html), in order to catch any unwanted changes in your UI.

The first time you run a Jest test containing `expect(func(x)).toMatchSnapshot()` a snapshot file will be generated. This contains a human readable output of the test. The next time this is run, if the output doesn't match the snapshot, Jest will warn you.
If you're aware there's going to be a change, you can run `yarn test -- updateSnapshots`.

# References
- [Jest docs](https://facebook.github.io/jest/docs/en/getting-started.html) - The official Jest documentation, the best place to get started
- [Using Babel](https://github.com/facebook/jest#using-babel) - Instructions on the use of Jest with Babel
- [Snapshot testing in Jest](https://hackernoon.com/front-end-react-snapshot-testing-with-jest-what-is-it-for-7788f7bd5a2e) - Great article on the how and why of snapshot testing in Jest
- [Snapshot Testing With Jest — Beyond React components](https://hackernoon.com/snapshot-testing-with-jest-beyond-react-components-7630fd0024c5) - Snapshot testing on things other than react components
