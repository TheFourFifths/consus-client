# Consus Client

[![Build Status](https://travis-ci.org/TheFourFifths/consus-client.svg?branch=master)](https://travis-ci.org/TheFourFifths/consus-client)

## Developing

### Getting Started

Note: You will need a local `consus` server running while using this application.

```bash
# Clone the repository
git clone git@github.com:TheFourFifths/consus-client.git
# Enter the project directory
cd consus
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
* `npm run build`: Build the usable .dist directory

## Project File Structure

* `src`: The project's source code
    * `lib`: Miscellaneous library modules
    * `store`: Flux stores which contain state and consume actions
    * `styles`: Styles built with Stylus
    * `views`: Visual components built with React
        * `components`: Smaller components
        * `pages`: Entire pages
* `test`: The project's tests
    * TODO
