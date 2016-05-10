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

function ajaxResponse(response, success) {
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
            retrieveData: function(endpointName, queryConfig, widgetParams, callback) {
                assert.ok(true);
                callback({data: []});
            }
        }
        return QuerybuilderAPI;
    })();
    assert.expect(2);

    var triggerClass = new TriggerMap("map-example");
    var form = new FilterForm("#filter");
    var api = new FakeQuerybuilderAPI("/endpoint/");
    var widgetParams;
    new MapLinker("#filter", "fake", api, widgetParams, triggerClass);
    $("#map-example").on("update:Map", function(event) {
        assert.ok(true);
    });
    $("#filter").trigger("submit");
});

test('TriggerMap default constructor', function(assert) {
    var triggerClass = new TriggerMap();
    assert.equal('filter', triggerClass.getContainer());
});

test('TriggerMap constructor', function(assert) {
    var triggerClass = new TriggerMap('fake');
    assert.equal('fake', triggerClass.getContainer());
})

test('TriggerMap setter', function(assert) {
    var triggerClass = new TriggerMap();
    triggerClass.setContainer('fake');
    assert.equal('fake', triggerClass.getContainer());
})

test('Retrieve data without filter.', function(assert) {
    FakeQuerybuilderAPI = (function(){
        var QuerybuilderAPI = function(url) {
        }
        QuerybuilderAPI.prototype = {
            retrieveData: function(endpointName, queryConfig, widgetParams, callback) {
                assert.ok(true);
                callback({data: []});
            }
        }
        return QuerybuilderAPI;
    })();
    assert.expect(2);

    var triggerClass = new TriggerMap("map-example");
    var filtername;
    var api = new FakeQuerybuilderAPI("/endpoint/");
    var widgetParams;
    $("#map-example").on("update:Map", function(event) {
        assert.ok(true);
    });
    new MapLinker(filtername, "fake", api, widgetParams, triggerClass);
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
    assert.equal(m.arrayMarkers.length, 1);
    assert.equal(m.arrayMarkers[0]._latlng.lat, 20);
    $.ajax = ajaxResponse('{ "status": "OK", "data": [{ "description": "My dummy JSON.", "latitude": 20.0, "longitude": 30.0}] }', false);
    $('#map-example').trigger({
        type: "update:Map",
        filteredData: {data: []}
    });
    assert.equal(m.arrayMarkers.length, 0);

});

test('Check if array marker is added and replaced.', function(assert) {

    var form = new FilterForm("#filter");
    var m = new Map(mapData);
    m.addMarker({latitude: 20.0, longitude: 30.0, description: "fake"}, m);
    assert.equal(m.arrayMarkers.length, 1);
    $.ajax = ajaxResponse('{ "status": "OK", "data": [{ "description": "My dummy JSON.", "latitude": 20.0, "longitude": 30.0}] }', false);
    var filteredData = {data: [{latitude: 21.0, longitude: 31.0, description: "fake_2"}]}
    $('#map-example').trigger("update:Map", filteredData);
    assert.equal(m.arrayMarkers.length, 1);
    assert.equal(m.arrayMarkers[0]._latlng.lat, 21);

});