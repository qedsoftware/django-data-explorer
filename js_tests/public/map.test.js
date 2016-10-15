import $ from 'jquery';
import QUnit from 'qunitjs';
import Map from '../../frontend_src/js/map';
import L from 'leaflet';
L.Icon.Default.imagePath = '../../django_data_explorer/static/django_data_explorer/libs/leaflet/dist/images';

const tableHTMLMap =
    '<filter-form>' +
        '<form id="filter">' +
            '<input type="submit">' +
        '</form>' +
    '</filter-form>' +
    '<div id="map-example">' +
    '</div>';

class ApiMock {
    retrieveData() {}
}

QUnit.module('application.Map', {
    beforeEach: () => {
        $('#qunit-fixture').append(tableHTMLMap);
    }
});

QUnit.test('Construct map without filter', function(assert) {

    var m = new Map("map-example", "", new ApiMock(), null);
    assert.equal(m.mapWidgetId, 'map-example');

});

QUnit.test('Construct map and filter', function(assert) {

    var m = new Map("map-example", "filter", new ApiMock(), null);
    assert.equal(m.mapWidgetId, 'map-example');
    $('#filter').trigger('submit');

});

QUnit.test('Check if array marker is added and deleted.', function(assert) {

    var m = new Map("map-example", "filter", new ApiMock(), null);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.arrayMarkers.length, 1);
    assert.equal(m.arrayMarkers[0]._latlng.lat, 20);
    $('#map-example').trigger({
        type: "update:Map",
        filteredData: {data: []}
    });
    assert.equal(m.arrayMarkers.length, 0);

});

QUnit.test('Check if array marker is added and replaced.', function(assert) {

    var m = new Map("map-example", "filter", new ApiMock(), null);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.arrayMarkers.length, 1);
    var filteredData = {data: [{latitude: 21.0, longitude: 31.0, description: "fake_2"}]};
    $('#map-example').trigger("update:Map", filteredData);
    assert.equal(m.arrayMarkers.length, 1);
    assert.equal(m.arrayMarkers[0]._latlng.lat, 21);

});