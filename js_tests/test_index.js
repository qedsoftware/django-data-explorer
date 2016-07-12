var testsContext = require.context(".", true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);

var componentsContext = require.context("../django_querybuilder/static/django_querybuilder/js", true, /\.js$/);
componentsContext.keys().forEach(componentsContext);