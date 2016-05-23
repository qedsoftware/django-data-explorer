/** AJAX map widget.
 * @constructor
 * @param {string} mapData - JSON string representing map parameters
 * @param {string} mapData.name - widget name used as container ID and
    endpoint parameter
 * @param {string} mapData.endpoint - URL of the API endpoint
 * @param {string} mapData.params - manually defined string that can be passed
    to the endpoint
 * @param {string} mapData.filter - optional filter ID
 */
var Map = (function() {
    'use strict';
    var Map = function(mapData) {
        mapData = JSON.parse(mapData);
        this.arrayMarkers = [];
        this.map = null;
        this.layerData = null;
        this.formID = mapData.filter ? '#' + mapData.filter : null;
        this.mapWidgetId = mapData.name;
        this.endpoint = mapData.endpoint;
        this.params = mapData.params;
        var _this = this;
        new FilterForm(this.formID);

        $(function () {
            setUpdateMapEventHandling('#' + _this.mapWidgetId);
            _this.init();
        });

        function setUpdateMapEventHandling(widgetId) {
            $(widgetId).on('update:Map', updateMap);
        }

        function updateMap(event, filterData) {
            removeAllLayers();
            addMarkers(filterData);
            zoomLeafletViewport();
        }

        function zoomLeafletViewport() {
            if (_this.arrayMarkers.length > 0) {
                var group = L.featureGroup(_this.arrayMarkers);
                _this.map.fitBounds(group.getBounds());
            }
        }

        function addMarkers(filterData) {
            if (filterData) {
                $.each(filterData.data, addSingleMarker);
            }
        }

        function addSingleMarker(_, marker) {
            _this.addMarker(marker, _this);
        }

        function removeAllLayers() {
            $.each(_this.array_markers, removeLayer);
            _this.arrayMarkers = [];
        }

        function removeLayer(layer) {
            _this.map.removeLayer(layer);
            _this.layerData.removeLayer(layer);
        }
    };

    return Map;
})();

Map.prototype = function() {
    var MapLinker = function(formID, endpointName, api, params,
                             triggerMap, mapWidgetId) {
        this.endpointName = endpointName;
        this.mapWidgetId = mapWidgetId;
        this.api = api;
        var _this = this;
        getData(formID);

        function getData(formID) {
            if (formID) {
                _this.form = $(formID).data('FilterForm');
                _this.form.onSubmit(getFilteredData);
            } else {
                getDefaultData();
            }
        }

        function getDefaultData() {
            var queryConfig = {containerID: mapWidgetId};
            _this.retrieveData(queryConfig, params, triggerMap);
        }

        function getFilteredData(event) {
            event.preventDefault();
            event.stopPropagation();
            var queryConfig = _this.form.serialize();
            _this.retrieveData(queryConfig, params, triggerMap);
        }
    };

    MapLinker.prototype = {
        retrieveData: function(queryConfig, params, callback) {
            return this.api.retrieveData(this.mapWidgetId,
                                         queryConfig, params, callback);
        }
    };

    function triggerMapFactory (containerID) {
        var container = containerID ? containerID : 'filter';
        return function (filteredData) {
            $('#' + container).trigger("update:Map", [filteredData]);
        };
    }

    function getLeafletConfig(osm, layerData) {
        return {
            center: [0.01, 51.405],
            zoom: 13,
            fullscreenControl: true,
            fullscreenOptions: {
                position: 'topleft'
            },
            layers: [osm, layerData]
        };
    }

    function getOsmTileLayer() {
        var osmURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
        var osmAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
        return new L.TileLayer(osmURL, {attribution: osmAttrib});
    }

    function getLeafletMap(widgetId, layerData) {
        var osm = getOsmTileLayer();
        var map = L.map(widgetId, getLeafletConfig(osm, layerData));
        var baseLayers = { "OpenStreetMap": osm };
        var overlays = { "Data Layer": layerData };
        L.control.layers(baseLayers, overlays).addTo(map);
        return map;
    }

    return {
        init: function() {
            'use strict';
            this.triggerMap = triggerMapFactory(this.mapWidgetId);
            this.map_class = new MapLinker(this.formID, this.endpoint,
                                           new QuerybuilderAPI(this.endpoint),
                                           this.params, this.triggerMap,
                                           this.mapWidgetId);
            this.layerData = new L.LayerGroup();
            this.arrayMarkers = [];
            this.map = getLeafletMap(this.mapWidgetId, this.layerData);
            this.map_class.retrieveData({containerID: this.mapWidgetId},
                                        this.params, this.triggerMap);
        },

        addMarker: function(obj, _this) {
            'use strict';
            var marker = L.marker({"lat": obj.latitude, "lng": obj.longitude});
            var popupText = obj.description;
    
            marker.bindPopup(popupText);
            marker.addTo(_this.layerData);
            _this.arrayMarkers.push(marker);
        }
    };
}();

