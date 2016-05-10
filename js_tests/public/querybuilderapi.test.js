module('application.QuerybuilderAPI');

test('Querybuilder url parameter.', function(assert) {
    var api = new QuerybuilderAPI("/endpoint/");
    assert.equal(api.url, '/endpoint/');
});
