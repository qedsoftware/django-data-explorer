var QUnit = require('qunitjs');
var QuerybuilderAPI = require('../../frontend_src/js/querybuilderapi');

QUnit.module('application.QuerybuilderAPI');

QUnit.test('Querybuilder url parameter.', function(assert) {
    var api = new QuerybuilderAPI("/endpoint/");
    assert.equal(api.url, '/endpoint/');
});
