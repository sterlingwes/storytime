# StoryTime

A simple time tracking menu bar app for scrum

## Todo

[See todos in open issues](https://github.com/sterlingwes/storytime/issues?q=is%3Aopen+is%3Aissue+label%3Atodo)

## Development

StoryTime is a React.js app using react-router and packaged with webpack. The compiled assets are then compiled with [Quark Shell](https://github.com/HackPlan/quark-shell-mac) into a Mac OS X menubar app.

Install dependencies:

`npm install`

Run the hot reload dev server on [localhost:8080](http://localhost:8080):

`npm start`

Run tests and generate coverage reports:

`npm test`

Tests are run with mocha through istanbul and use React.TestUtils to simulate events, expect.js for assertions and sinon.js for stubbing and mocking.

### Node Versioning

Owing to dependency issues, a node version manager is necessary for development.

*  node 1.1 to run the dev server
*  node 0.10 to run tests

Closing this gap is a WIP.

### Building & Distributing

Coming soon.

## License

MIT