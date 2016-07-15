var testsContext = require.context(".", true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);

var componentsContext = require.context("../src/js", true, /\.js$/);
componentsContext.keys().forEach(componentsContext);