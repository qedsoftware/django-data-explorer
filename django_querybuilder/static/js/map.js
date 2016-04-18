var MapScript = (function() {

MapLinker = (function(){
    'use strict';
    var MapLinker = function(containerID, formID, endpointName, api) {
        this.containerID = containerID;
        this.form = $(formID).data('FilterForm');
        this.endpointName = endpointName;
        this.api = api;
        var _this = this;
        this.form.onSubmit(function(event) {
            event.preventDefault();
            var parameters = _this.form.serialize();
            _this.retrieveData(parameters, function(filteredData) {
                $('#' + containerID).trigger({
                    type: "update:Map",
                    filteredData: filteredData
                });
            });
        });
    };

    MapLinker.prototype = {
        retrieveData: function(parameters, callback) {
            return this.api.retrieveData(this.containerID, parameters, callback);
        }
    };

    return MapLinker;
})();

Map = function() {
    
    mapData = JSON.parse(mapData);
    this.array_markers = Array();
    this.map;
    this.layer_data;
    this.widgetId = mapData.name;
    this.endpoint = '/' + mapData.endpoint + '/';
    this.formID = '#filter';
    var _this = this;
    new FilterForm(this.formID);

    $('#' + this.widgetId).on("update:Map", function(event) {
            for (var i = 0; i < _this.array_markers.length; i++) {
                _this.map.removeLayer(_this.array_markers[i]);
                _this.layer_data.removeLayer(_this.array_markers[i]);
            }
            for (var i = 0; i < event.filteredData.data.length; i++) {
                var obj = event.filteredData.data[i];
                _this.addMarker(obj, _this);
            }

            if (_this.array_markers.length > 0) {
                var group = L.featureGroup(_this.array_markers);
                _this.map.fitBounds(group.getBounds());
            }
        });

    var that = this;
    $(function () {
        that.init(mapData);
    });
    return Map;
};

Map.prototype = {
        init: function(mapData) {
            'use strict';
            var _this = this;
            this.map_class = new MapLinker(_this.widgetId, _this.formID, _this.endpoint, new QuerybuilderAPI(_this.endpoint));

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
            
            $("#filter").trigger("submit");
        }
    };
    
Map.prototype.addMarker = function(obj, _this) {
        var lon = 0.0;
        var lat = 0.0;
        for(var key in obj.fields) {
            if (key == 'longitude') {
                lon = parseFloat(obj.fields[key]);
            }
            if (key == 'latitude') {
                lat = parseFloat(obj.fields[key]);
            }
        }
        var marker = L.marker([lat, lon]);
        var firstIteration = true;
        var popup_text = "";

        for (var key in obj.fields) {
            if (key != 'latitude' && key != 'longitude') {
                if (firstIteration) {
                    firstIteration = false;
                    popup_text = popup_text + '<strong>' + key + ': </strong>' + obj.fields[key] + '<br>';
                }
                else {
                    popup_text = popup_text + '<strong>' + key + ': </strong>' + obj.fields[key] + '<br>';
                }
            }
        }

        marker.bindPopup(
            popup_text
        );

        marker.addTo(_this.map);
        marker.addTo(_this.layer_data);
        _this.array_markers.push(marker);

        if (_this.array_markers.length > 0) {
            var group = L.featureGroup(_this.array_markers);
            _this.map.fitBounds(group.getBounds());
        }       
    };
    return MapScript;
})();