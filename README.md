# Consus Client

[![Build Status](https://travis-ci.org/TheFourFifths/consus-client.svg?branch=dev)](https://travis-ci.org/TheFourFifths/consus-client)
[![codecov](https://codecov.io/gh/TheFourFifths/consus-client/branch/dev/graph/badge.svg)](https://codecov.io/gh/TheFourFifths/consus-client)
[![devDependency Status](https://david-dm.org/TheFourFifths/consus-client/dev-status.svg)](https://david-dm.org/TheFourFifths/consus-client?type=dev)

## Developing

### Getting Started

Note: You will need a local `consus` server running while using this application.

```bash
# Clone the repository
git clone git@github.com:TheFourFifths/consus-client.git
# Enter the project directory
cd consus-client
# Install dependencies
npm install
# Build the project
npm run build
# Start the application
npm start
```

### Development Scripts

* `npm test`: Run the test suite
* `npm run lint`: Run the linter
* `npm run integration-test`: Run the integration tests (requires server listening on port 8081)
* `npm run lintless-test`: Run the test suite without linting
* `npm run build`: Build the usable .dist directory
* `npm run coverage`: Generate a code coverage report

## Project File Structure

* `src`: The project's source code
    * `lib`: Miscellaneous library modules
    * `store`: Flux stores which contain state and consume actions
    * `styles`: Styles built with Stylus
    * `views`: Visual components built with React
        * `components`: Smaller components
        * `pages`: Entire pages
* `test`: The project's tests
    * `functional`: Functional tests
    * `test-cases`: Test case values
    * `unit`: Unit tests
    * `util`: Testing utilities
