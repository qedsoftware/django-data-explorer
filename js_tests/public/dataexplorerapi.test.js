import QUnit from'qunitjs';
import DataExplorerAPI from '../../frontend_src/js/dataexplorerapi';

QUnit.module('application.DataExplorerAPI');

QUnit.test('Data Explorer url parameter.', function(assert) {
    var api = new DataExplorerAPI("/endpoint/");
    assert.equal(api.url, '/endpoint/');
});
