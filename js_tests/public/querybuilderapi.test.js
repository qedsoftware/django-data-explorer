import QUnit from'qunitjs';
import QuerybuilderAPI from '../../frontend_src/js/querybuilderapi';

QUnit.module('application.QuerybuilderAPI');

QUnit.test('Querybuilder url parameter.', function(assert) {
    var api = new QuerybuilderAPI("/endpoint/");
    assert.equal(api.url, '/endpoint/');
});
