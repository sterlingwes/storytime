# react-dev-boilerplate

### Usage

```
npm install
npm start
open http://localhost:8080
```

The idea is to develop one-off React.js components using this method, in an "isolated environment" (where they're the only thing on the page), then include them in your projects via a module loader like [Webpack](http://webpack.github.io) by  requiring the component file directly (in this case, `src/app.js`), and mounting that separately in your application.

Note that JSX is compiled via the `6to5-loader` webpack loader, which also enables the use of ES6 javascript.

### Todo

Basic test suite setup.