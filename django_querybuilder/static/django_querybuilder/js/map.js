/** AJAX map widget.
 * @constructor
 * @description Reads from some global variables? Well, this has to be
 *    refactored anyway.
 */
var MapScript = (function() {

MapLinker = (function(){
    'use strict';
    var MapLinker = function(containerID, formID, endpointName, api, widget_params) {
        this.containerID = containerID;
        this.form = $(formID).data('FilterForm');
        this.endpointName = endpointName;
        this.api = api;
        var _this = this;
        this.form.onSubmit(function(event) {
            event.preventDefault();
            var query_config = _this.form.serialize();
            _this.retrieveData(query_config, widget_params, function(filteredData) {
                $('#' + containerID).trigger({
                    type: "update:Map",
                    filteredData: filteredData
                });
            });
        });
    };

    MapLinker.prototype = {
        retrieveData: function(query_config, widget_params, callback) {
            return this.api.retrieveData(this.containerID, query_config,
                                         widget_params, callback);
        }
    };

    return MapLinker;
})();

Map = (function() {
    'use strict'

    var Map = function(mapData) {
        mapData = JSON.parse(mapData);
        this.array_markers = Array();
        this.map;
        this.layer_data;
        this.widgetId = mapData.name;
        this.endpoint = '/' + mapData.endpoint + '/';
        this.formID = '#' + mapData.filter;
        this.widget_params = mapData.widget_params
        var _this = this;
        new FilterForm(this.formID);

        $('#' + this.widgetId).on("update:Map", function(event) {
                for (var i = 0; i < _this.array_markers.length; i++) {
                    _this.map.removeLayer(_this.array_markers[i]);
                    _this.layer_data.removeLayer(_this.array_markers[i]);
                }
                _this.array_markers = Array()
                for (var i = 0; i < event.filteredData.data.length; i++) {
                    var obj = event.filteredData.data[i];
                    _this.addMarker(obj, _this);
                }

                if (_this.array_markers.length > 0) {
                    var group = L.featureGroup(_this.array_markers);
                    _this.map.fitBounds(group.getBounds());
                }
            });

        $(function () {
            _this.init();
        });
    };

    return Map;
})();

Map.prototype = {
        init: function() {
            'use strict';
            var _this = this;
            this.map_class = new MapLinker(_this.widgetId, _this.formID, _this.endpoint,
                                           new QuerybuilderAPI(_this.endpoint), _this.widget_params);

            var osmURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            var osmAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
            var osm = new L.TileLayer(osmURL, {attribution: osmAttrib});

            this.layer_data = new L.LayerGroup();
            this.array_markers = new Array();

            this.map = L.map(this.widgetId, {
                center: [0.01, 51.405],
                zoom: 13,
                fullscreenControl: true,
                fullscreenOptions: {
                    position: 'topleft'
                },
                layers: [osm, this.layer_data]
            });

            var baseLayers = {
                "OpenStreetMap": osm
            };

            var overlays = {
                "Data Layer": this.layer_data
            };

            L.control.layers(baseLayers, overlays).addTo(this.map);

            $(_this.formID).trigger("submit");
        },

        addMarker: function(obj, _this) {
            'use strict'
        
            var marker = L.marker({"lat": obj.latitude, "lng": obj.longitude});
            var popup_text = obj.description;

            marker.bindPopup(popup_text);

            marker.addTo(_this.layer_data);
            _this.array_markers.push(marker);
        }
    };

    return MapScript;
})()