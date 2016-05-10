module('application.Map', {
    beforeEach: function() {
        $('#qunit-fixture').append(tableHTMLMap);
    }
});

var tableHTMLMap =
    '<filter-form>' +
        '<form id="filter">' +
            '<input type="submit">' +
        '</form>' +
    '</filter-form>' +
    '<div id="map-example">' +
    '</div>';

var mapData = '{"name": "map-example", "endpoint": "", "filter": "filter"}';

function ajax_response(response, success) {
  return function (params) {
    if (success) {
      params.success(response);
    } else {
      params.error(response);
    }
  };
}

test('Update Map after form submission.', function(assert) {
    FakeQuerybuilderAPI = (function(){
        var QuerybuilderAPI = function(url) {
        }
        QuerybuilderAPI.prototype = {
            retrieveData: function(endpointName, query_config, widget_params, callback) {
                assert.ok(true);
                callback({data: []});
            }
        }
        return QuerybuilderAPI;
    })();
    assert.expect(2);

    var form = new FilterForm("#filter");
    var api = new FakeQuerybuilderAPI("/endpoint/");
    new MapLinker("map-example", "#filter", "fake", api);
    $("#map-example").on("update:Map", function(event) {
        assert.ok(true);
    });
    $("#filter").trigger("submit");
});

test('Check if data passed.', function(assert) {

    var form = new FilterForm("#filter");
    var m = new Map(mapData);
    assert.equal(m.widgetId,'map-example');

});

test('Check if array marker is added and deleted.', function(assert) {

    var form = new FilterForm("#filter");
    var m = new Map(mapData);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.array_markers.length, 1);
    assert.equal(m.array_markers[0]._latlng.lat, 20);
    $.ajax = ajax_response('{ "status": "OK", "data": [{ "description": "My dummy JSON.", "latitude": 20.0, "longitude": 30.0}] }', false);
    $('#map-example').trigger({
        type: "update:Map",
        filteredData: {data: []}
    });
    assert.equal(m.array_markers.length, 0);

});

test('Check if array marker is added and replaced.', function(assert) {

    var form = new FilterForm("#filter");
    var m = new Map(mapData);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.array_markers.length, 1);
    $.ajax = ajax_response('{ "status": "OK", "data": [{ "description": "My dummy JSON.", "latitude": 20.0, "longitude": 30.0}] }', false);
    $('#map-example').trigger({
        type: "update:Map",
        filteredData: {data: [{latitude: 21.0, longitude: 31.0, description: "fake_2"}]}
    });
    assert.equal(m.array_markers.length, 1);
    assert.equal(m.array_markers[0]._latlng.lat, 21);

});