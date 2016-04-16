module('application.Table');

var tableHTML =
    '<filter-form>' +
        '<form id="filter">' +
            '<input type="submit">' +
        '</form>' +
    '</filter-form>' +
    '<table id="table">' +
    '</table>';

test('Update after form submission.', function(assert) {
    FakeQuerybuilderAPI = (function(){
        var QuerybuilderAPI = function(url) {
        }
        QuerybuilderAPI.prototype = {
            retrieveData: function(endpointName, parameters, callback) {
                callback();
            }
        }
        return QuerybuilderAPI;
    })();
    assert.expect(1);

    $("#qunit-fixture").append(tableHTML);

    var form = new FilterForm("#filter");
    var api = new FakeQuerybuilderAPI("/endpoint/");
    new Table("#table", '#filter', "blah", api);
    $("#table").on("update:Table", function(event) {
        assert.ok(true);
    });
    $("#filter").trigger("submit");
});
