var testsContext = require.context(".", true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);

var componentsContext = require.context("../frontend_src/js", true, /\.js$/);
componentsContext.keys().forEach(componentsContext);