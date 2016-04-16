var MapScript = (function() {

MapLinker = (function(){
    'use strict';
    var MapLinker = function(containerID, form, endpointName, api) {
        this.containerID = containerID;
        this.form = form;
        this.endpointName = endpointName;
        this.api = api;
        var _this = this;
        this.form.onSubmit(function(event) {
            event.preventDefault()
            var dict = {};
            if (event.formData !== undefined) {
                for (var i = 0; i < event.formData.length; i++) {
                    var key = event.formData[i].name;
                    var value = event.formData[i].value;
                    dict[key] = value;
                }
            }
            var filteredData = _this.retrieveData(dict);
            
            $(containerID).trigger({
                type: "update:Map",
                filteredData: filteredData
            });
        });
    }

    MapLinker.prototype = {
        retrieveData: function(filter_data) {
            return this.api.retrieveData(this.endpointName, filter_data);
        }
    };

    return MapLinker;
})();

Map = function() {
    
    mapData = JSON.parse(mapData);
    this.array_markers = Array();
    this.map;
    this.layer_data;
    this.widgetId = mapData.widget_id;
    this.endpoint = '/' + mapData.endpoint_id + '/';
    this.form = new FilterForm('#filter');
    
    function isFunction(possibleFunction) {
        return typeof(possibleFunction) === typeof(Function);
    }
    
    $('#' + this.widgetId).on("update:Map", function(event) {
            for (var i = 0; i < this.array_markers.length; i++) {
                this.map.removeLayer(this.array_markers[i]);
                this.layer_data.removeLayer(this.array_markers[i]);
            }
            for (var i = 0; i < event.filteredData.length; i++) {
                var obj = data[i];
                addMarker(obj);
            }

            if (this.array_markers.length > 0) {
                var group = L.featureGroup(this.array_markers);
                this.map.fitBounds(group.getBounds());
            }
        });

    this.init(mapData);
    return Map;
};

Map.prototype = {
        init: function(mapData) {
            'use strict';
            var _this = this;
            this.map_class = new MapLinker(_this.widgetId, _this.form, _this.endpoint, new QuerybuilderAPI());

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
    
Map.prototype.addMarker = function(obj) {
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

        marker.addTo(this.map);
        marker.addTo(this.layer_data);
        this.array_markers.push(marker);

        if (this.array_markers.length > 0) {
            var group = L.featureGroup(this.array_markers);
            this.map.fitBounds(group.getBounds());
        }       
    };
    return MapScript;
})();