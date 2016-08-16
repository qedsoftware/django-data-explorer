import QUnit from 'qunitjs';
import $ from 'jquery';
import FilterForm from '../../frontend_src/js/filterui';
import Table from '../../frontend_src/js/table';

QUnit.module('application.Table');

const tableHTML =
    '<filter-form>' +
        '<form id="filter">' +
            '<input type="submit">' +
        '</form>' +
    '</filter-form>' +
    '<div id="table">' +
    '</div>' +
    '<table id="table_t">' +
    '</table>';



QUnit.test('Update after form submission.', function(assert) {
    class FakeQuerybuilderAPI {
        constructor(url) {
            this.url = url
        }
        retrieveData(endpointName, query_config, widget_params, callback) {
            assert.ok(true);
            callback({data: {aaData:[], iTotalRecords:0, iTotalDisplayRecords:0}});
        }
    }
    assert.expect(2);

    $("#qunit-fixture").append(tableHTML);

    new FilterForm("#filter");
    var api = new FakeQuerybuilderAPI("/endpoint/");
    new Table("#table", '#filter', "endpoint", api);
    $("#filter").trigger("submit");
});

QUnit.test('Initialize without FilterForm', function(assert) {
    class FakeQuerybuilderAPI {
        constructor(url) {
            this.url = url;
        }
        retrieveData(endpointName, query_config, widget_params, callback) {
            assert.ok(true);
            callback({data: {aaData:[], iTotalRecords:0, iTotalDisplayRecords:0}});
        }
    }
    $("#qunit-fixture").append(tableHTML);

    var api = new FakeQuerybuilderAPI("/endpoint/");
    new Table("#table", '', "endpoint", api);
    assert.ok(true);
});
