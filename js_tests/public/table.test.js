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
    assert.expect(1);

    $("#qunit-fixture").append(tableHTML);

    FilterForm("#filter");
    new Table("#table", "#filter");
    $("#table").on("update:Table", function() {
        assert.ok(true);;
    });
    $("#filter").trigger("submit");
});