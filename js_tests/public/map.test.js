var $ = require('jquery');
var QUnit = require('qunitjs');
var Map = require('../../django_querybuilder/static/django_querybuilder/js/map');
L.Icon.Default.imagePath = '../../django_querybuilder/static/django_querybuilder/libs/leaflet/dist/images';


QUnit.module('application.Map', {
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

var mapOnlyData = '{"name": "map-example", "endpoint": "", "filter": ""}';
var mapData = '{"name": "map-example", "endpoint": "", "filter": "filter"}';

function ajaxResponse(response, success) {
  return function (params) {
    if (success) {
      params.success(response);
    } else {
      params.error(response);
    }
  };
}

QUnit.test('Construct map without filter', function(assert) {

    var m = new Map(mapOnlyData);
    assert.equal(m.mapWidgetId,'map-example');

});

QUnit.test('Construct map and filter', function(assert) {

    var m = new Map(mapData);
    assert.equal(m.mapWidgetId,'map-example');
    $('#filter').trigger('submit');

});

QUnit.test('Check if array marker is added and deleted.', function(assert) {

    var m = new Map(mapData);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.arrayMarkers.length, 1);
    assert.equal(m.arrayMarkers[0]._latlng.lat, 20);
    $.ajax = ajaxResponse('{ "status": "OK", "data": [{ "description": "My dummy JSON.", "latitude": 20.0, "longitude": 30.0}] }', false);
    $('#map-example').trigger({
        type: "update:Map",
        filteredData: {data: []}
    });
    assert.equal(m.arrayMarkers.length, 0);

});

QUnit.test('Check if array marker is added and replaced.', function(assert) {

    var m = new Map(mapData);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.arrayMarkers.length, 1);
    $.ajax = ajaxResponse('{ "status": "OK", "data": [{ "description": "My dummy JSON.", "latitude": 20.0, "longitude": 30.0}] }', false);
    var filteredData = {data: [{latitude: 21.0, longitude: 31.0, description: "fake_2"}]};
    $('#map-example').trigger("update:Map", filteredData);
    assert.equal(m.arrayMarkers.length, 1);
    assert.equal(m.arrayMarkers[0]._latlng.lat, 21);

});