Table = (function(){
    'use strict';

    var Table = function(containerID, formID, endpointName, api) {
        this.containerID = containerID;
        this.form = $(formID).data('FilterForm');
        this.endpointName = endpointName;
        this.api = api;

        var _this = this;
        this.form.onSubmit(function(event) {
            event.preventDefault();
            var parameters = _this.form.serialize();
            _this.retrieveData(parameters, function(data) {
                $(containerID).trigger({
                    type: "update:Table",
                    message: data
                });
            });
        });
    };

    Table.prototype = {
        retrieveData: function(parameters, callback) {
            this.api.retrieveData(this.endpointName, parameters, callback);
        }
    };

    return Table;
})();
