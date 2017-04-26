'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _filterui = require('./filterui');

var _filterui2 = _interopRequireDefault(_filterui);

var _dataexplorerapi = require('./dataexplorerapi');

var _dataexplorerapi2 = _interopRequireDefault(_dataexplorerapi);

var _registerwidgetclass = require('./registerwidgetclass');

var _registerwidgetclass2 = _interopRequireDefault(_registerwidgetclass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** AJAX map widget.
 * @constructor
 * @param {string} name - widget name used as container ID and
 endpoint parameter
 * @param {string} formID - optional filter ID
 * @param {DataExplorerAPI} api - the endpoint
 * @param {string} params - manually defined string that can be passed
 to the endpoint
 */
var Map = function () {
    function Map(name, formID, api, params) {
        _classCallCheck(this, Map);

        this.arrayMarkers = [];
        this.map = null;
        this.layerData = null;
        this.formID = formID ? '#' + formID : null;
        this.mapWidgetId = name;
        this.api = api;
        this.params = params;
        new _filterui2.default(this.formID);
        this._setUpdateMapEventHandling('#' + this.mapWidgetId);
        this.init();
    }

    _createClass(Map, [{
        key: 'init',
        value: function init() {
            this.triggerMap = triggerMapFactory(this.mapWidgetId);
            this.map_class = new MapLinker(this.formID, this.api, this.params, this.triggerMap, this.mapWidgetId);
            this.layerData = new _leaflet2.default.LayerGroup();
            this.arrayMarkers = [];
            this.map = getLeafletMap(this.mapWidgetId, this.layerData);
            this.map_class.retrieveData({ containerID: this.mapWidgetId }, this.params, this.triggerMap);
        }
    }, {
        key: 'addMarker',
        value: function addMarker(obj) {
            var marker = _leaflet2.default.marker({ "lat": obj.latitude, "lng": obj.longitude });
            var popupText = obj.description;

            marker.bindPopup(popupText);
            marker.addTo(this.layerData);
            this.arrayMarkers.push(marker);
        }
    }, {
        key: '_setUpdateMapEventHandling',
        value: function _setUpdateMapEventHandling(widgetId) {
            (0, _jquery2.default)(widgetId).on('update:Map', this._updateMap.bind(this));
        }
    }, {
        key: '_updateMap',
        value: function _updateMap(event, filterData) {
            this._removeAllLayers();
            this._addMarkers(filterData);
            this._zoomLeafletViewport();
        }
    }, {
        key: '_zoomLeafletViewport',
        value: function _zoomLeafletViewport() {
            if (this.arrayMarkers.length > 0) {
                var group = _leaflet2.default.featureGroup(this.arrayMarkers);
                this.map.fitBounds(group.getBounds());
            }
        }
    }, {
        key: '_addMarkers',
        value: function _addMarkers(filterData) {
            if (filterData) {
                filterData.data.forEach(this._addSingleMarker.bind(this));
            }
        }
    }, {
        key: '_addSingleMarker',
        value: function _addSingleMarker(marker) {
            this.addMarker(marker);
        }
    }, {
        key: '_removeAllLayers',
        value: function _removeAllLayers() {
            this.arrayMarkers.forEach(this._removeLayer.bind(this));
            this.arrayMarkers = [];
        }
    }, {
        key: '_removeLayer',
        value: function _removeLayer(layer) {
            this.map.removeLayer(layer);
            this.layerData.removeLayer(layer);
        }
    }], [{
        key: 'register',
        value: function register(element) {
            var mapElement = (0, _jquery2.default)(element);
            var mapData = mapElement.data("django-data-explorer-map");

            _leaflet2.default.Icon.Default.imagePath = mapData.imageUrl;

            var api = new _dataexplorerapi2.default(mapData.endpoint);
            return new Map(mapData.name, mapData.filter, api, mapData.params);
        }
    }]);

    return Map;
}();

var MapLinker = function () {
    function MapLinker(formID, api, params, triggerMap, mapWidgetId) {
        _classCallCheck(this, MapLinker);

        this.mapWidgetId = mapWidgetId;
        this.api = api;
        this._getData(formID);
        this.triggerMap = triggerMap;
        this.params = params;
    }

    _createClass(MapLinker, [{
        key: 'retrieveData',
        value: function retrieveData(queryConfig, params, callback) {
            return this.api.retrieveData(this.mapWidgetId, queryConfig, params, callback);
        }
    }, {
        key: '_getData',
        value: function _getData(formID) {
            if (formID) {
                this.form = (0, _jquery2.default)(formID).data('FilterForm');
                this.form.onSubmit(this._getFilteredData.bind(this));
            } else {
                this._getDefaultData();
            }
        }
    }, {
        key: '_getDefaultData',
        value: function _getDefaultData() {
            var queryConfig = { containerID: this.mapWidgetId };
            this.retrieveData(queryConfig, this.params, this.triggerMap);
        }
    }, {
        key: '_getFilteredData',
        value: function _getFilteredData(event) {
            event.preventDefault();
            event.stopPropagation();
            var queryConfig = this.form.serialize();
            this.retrieveData(queryConfig, this.params, this.triggerMap);
        }
    }]);

    return MapLinker;
}();

function triggerMapFactory(containerID) {
    var container = containerID ? containerID : 'filter';
    return function (filteredData) {
        (0, _jquery2.default)('#' + container).trigger("update:Map", [filteredData]);
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
    return new _leaflet2.default.TileLayer(osmURL, { attribution: osmAttrib });
}

function getLeafletMap(widgetId, layerData) {
    var osm = getOsmTileLayer();
    var map = _leaflet2.default.map(widgetId, getLeafletConfig(osm, layerData));
    var baseLayers = { "OpenStreetMap": osm };
    var overlays = { "Data Layer": layerData };
    _leaflet2.default.control.layers(baseLayers, overlays).addTo(map);
    return map;
}

(0, _registerwidgetclass2.default)("map", Map);

exports.default = Map;