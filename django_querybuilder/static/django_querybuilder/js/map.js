/** AJAX map widget.
 * @constructor
 * @description Reads from some global variables? Well, this has to be
 *    refactored anyway.
 */
var MapScript = (function() {

TriggerMap = (function() {
    'use strict';
    var container;

    var TriggerMap = function(containerID) {
        container = containerID ? containerID : 'filter';
    };

    TriggerMap.prototype = {
        setContainer: function(value) {
            container = value;
        },

        getContainer: function() {
            return container;
        },

        triggerMap: function(filteredData) {
            $('#' + container).trigger("update:Map", [filteredData]);
        }
    };

    return TriggerMap;
})();

MapLinker = (function() {
    'use strict';
    var MapLinker = function(formID, endpointName, api, params,
                             triggerClass) {
        if (formID) {
            this.form = $(formID).data('FilterForm');
        }
        this.triggerClass = triggerClass;
        this.endpointName = endpointName;
        this.api = api;
        var _this = this;
        if (this.form) {
            this.form.onSubmit(function(event) {
                event.preventDefault();
                var queryConfig = _this.form.serialize();
                _this.retrieveData(queryConfig, params, triggerClass.triggerMap);
            });
        }
        else {
            _this.retrieveData({containerID: triggerClass.getContainer()},
                                params, triggerClass.triggerMap);
        }
    };

    MapLinker.prototype = {
        retrieveData: function(queryConfig, params, callback) {
            return this.api.retrieveData(this.triggerClass.getContainer(),
                                         queryConfig, params, callback);
        }
    };

    return MapLinker;
})();

Map = (function() {
    'use strict';
    var Map = function(mapData) {
        mapData = JSON.parse(mapData);
        this.arrayMarkers = [];
        this.map = null;
        this.layer_data = null;
        this.formID = mapData.filter ? '#' + mapData.filter : null;
        this.widgetId = mapData.name;
        this.endpoint = mapData.endpoint;
        this.params = mapData.params;
        var _this = this;
        new FilterForm(this.formID);

        $('#' + this.widgetId).on("update:Map", function(event, filterData) {
            for (var i = 0; i < _this.arrayMarkers.length; i++) {
                _this.map.removeLayer(_this.arrayMarkers[i]);
                _this.layer_data.removeLayer(_this.arrayMarkers[i]);
            }
            _this.arrayMarkers = [];
            if (filterData) {
                for (i = 0; i < filterData.data.length; i++) {
                    var obj = filterData.data[i];
                    _this.addMarker(obj, _this);
                }
            }

            if (_this.arrayMarkers.length > 0) {
                var group = L.featureGroup(_this.arrayMarkers);
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
        this.triggerClass = new TriggerMap(_this.widgetId);
        this.map_class = new MapLinker(_this.formID, _this.endpoint, new QuerybuilderAPI(_this.endpoint),
                                       _this.params, _this.triggerClass);
        var osmURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
        var osmAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmURL, {attribution: osmAttrib});

        this.layer_data = new L.LayerGroup();
        this.arrayMarkers = [];

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
        this.map_class.retrieveData({containerID: this.triggerClass.getContainer()},
                                    _this.params, this.triggerClass.triggerMap);
    },

    addMarker: function(obj, _this) {
        'use strict';
        var marker = L.marker({"lat": obj.latitude, "lng": obj.longitude});
        var popupText = obj.description;

        marker.bindPopup(popupText);

        marker.addTo(_this.layer_data);
        _this.arrayMarkers.push(marker);
    }
};

    return MapScript;
})();