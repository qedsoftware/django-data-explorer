import $ from 'jquery';
import L from 'leaflet';

import FilterForm from './filterui';
import DataExplorerAPI from './dataexplorerapi';
import registerWidgetClass from './registerwidgetclass';

/** AJAX map widget.
 * @constructor
 * @param {string} name - widget name used as container ID and
 endpoint parameter
 * @param {string} formID - optional filter ID
 * @param {DataExplorerAPI} api - the endpoint
 * @param {string} params - manually defined string that can be passed
 to the endpoint
 */
class Map {

    constructor(name, formID, api, params) {
        this.arrayMarkers = [];
        this.map = null;
        this.layerData = null;
        this.formID = formID ? '#' + formID : null;
        this.mapWidgetId = name;
        this.api = api;
        this.params = params;
        new FilterForm(this.formID);
        this._setUpdateMapEventHandling('#' + this.mapWidgetId);
        this.init();
    }

    init() {
        this.triggerMap = triggerMapFactory(this.mapWidgetId);
        this.map_class = new MapLinker(this.formID,
            this.api,
            this.params, this.triggerMap,
            this.mapWidgetId);
        this.layerData = new L.LayerGroup();
        this.arrayMarkers = [];
        this.map = getLeafletMap(this.mapWidgetId, this.layerData);
        this.map_class.retrieveData({containerID: this.mapWidgetId},
            this.params, this.triggerMap);
    }

    addMarker (obj) {
        var marker = L.marker({"lat": obj.latitude, "lng": obj.longitude});
        var popupText = obj.description;

        marker.bindPopup(popupText);
        marker.addTo(this.layerData);
        this.arrayMarkers.push(marker);
    }

    _setUpdateMapEventHandling(widgetId) {
        $(widgetId).on('update:Map', this._updateMap.bind(this));
    }

    _updateMap(event, filterData) {
        this._removeAllLayers();
        this._addMarkers(filterData);
        this._zoomLeafletViewport();
    }

    _zoomLeafletViewport() {
        if (this.arrayMarkers.length > 0) {
            var group = L.featureGroup(this.arrayMarkers);
            this.map.fitBounds(group.getBounds());
        }
    }

    _addMarkers(filterData) {
        if (filterData) {
            filterData.data.forEach(this._addSingleMarker.bind(this));
        }
    }

    _addSingleMarker(marker) {
        this.addMarker(marker);
    }

    _removeAllLayers() {
        this.arrayMarkers.forEach(this._removeLayer.bind(this));
        this.arrayMarkers = [];
    }

    _removeLayer(layer) {
        this.map.removeLayer(layer);
        this.layerData.removeLayer(layer);
    }

    static register(element) {
        var mapElement = $(element);
        var mapData = mapElement.data("django-data-explorer-map");

        L.Icon.Default.imagePath = mapData.imageUrl;

        var api = new DataExplorerAPI(mapData.endpoint);
        return new Map(mapData.name, mapData.filter, api, mapData.params);
    }
}

class MapLinker {

    constructor(formID, api, params, triggerMap, mapWidgetId) {
        this.mapWidgetId = mapWidgetId;
        this.api = api;
        this._getData(formID);
        this.triggerMap = triggerMap;
        this.params = params;
    }

    retrieveData(queryConfig, params, callback) {
        return this.api.retrieveData(this.mapWidgetId,
            queryConfig, params, callback);
    }

    _getData(formID) {
        if (formID) {
            this.form = $(formID).data('FilterForm');
            this.form.onSubmit(this._getFilteredData.bind(this));
        } else {
            this._getDefaultData();
        }
    }

    _getDefaultData() {
        var queryConfig = {containerID: this.mapWidgetId};
        this.retrieveData(queryConfig, this.params, this.triggerMap);
    }

    _getFilteredData(event) {
        event.preventDefault();
        event.stopPropagation();
        var queryConfig = this.form.serialize();
        this.retrieveData(queryConfig, this.params, this.triggerMap);
    }
}

function triggerMapFactory(containerID) {
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
    var baseLayers = {"OpenStreetMap": osm};
    var overlays = {"Data Layer": layerData};
    L.control.layers(baseLayers, overlays).addTo(map);
    return map;
}

registerWidgetClass("map", Map);

export default Map;
