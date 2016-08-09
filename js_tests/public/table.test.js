var QUnit = require('qunitjs');
var FilterForm = require('../../frontend_src/js/filterui');
var Table = require('../../frontend_src/js/table');
var $ = require('jquery');

QUnit.module('application.Table');

var tableHTML =
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
    var FakeQuerybuilderAPI = (function(){
        var QuerybuilderAPI = function(url) {
        };
        QuerybuilderAPI.prototype = {
            retrieveData: function(endpointName, query_config, widget_params, callback) {
                assert.ok(true);
                callback({data: {aaData:[], iTotalRecords:0, iTotalDisplayRecords:0}});
            }
        };
        return QuerybuilderAPI;
    })();

    assert.expect(2);

    $("#qunit-fixture").append(tableHTML);

    new FilterForm("#filter");
    var api = new FakeQuerybuilderAPI("/endpoint/");
    new Table("#table", '#filter', "endpoint", api);
    $("#filter").trigger("submit");
});

QUnit.test('Initialize without FilterForm', function(assert) {
    var FakeQuerybuilderAPI = (function(){
        var QuerybuilderAPI = function(url) {
        };
        QuerybuilderAPI.prototype = {
            retrieveData: function(endpointName, query_config, widget_params, callback) {
                callback({data: {aaData:[], iTotalRecords:0, iTotalDisplayRecords:0}});
            }
        };
        return QuerybuilderAPI;
    })();

    $("#qunit-fixture").append(tableHTML);

    var api = new FakeQuerybuilderAPI("/endpoint/");
    new Table("#table", '', "endpoint", api);
    assert.ok(true);
});
