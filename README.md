# Storytime

A simple time tracking menu bar app

![Screenshot](https://cloud.githubusercontent.com/assets/1047502/6642736/65c83f06-c97d-11e4-91c0-e98dd0fc3479.png)

## Development

Storytime is a React.js app using react-router and packaged with webpack. The compiled assets are then compiled with [Quark Shell](https://github.com/HackPlan/quark-shell-mac) into a Mac OS X menubar app.

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

Closing this gap is a WIP. In the meantime use nvm or nave to switch between the two.

### Building & Distributing

Coming soon.

## License

MIT