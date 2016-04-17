Table = (function(){
    'use strict';

    var Table = function(containerID, form, endpointName, api) {
        this.containerID = containerID;
        this.form = form;
        this.endpointName = endpointName;
        this.api = api;

        var _this = this;
        form.onSubmit(function(event) {
            event.preventDefault();
            var data = _this.retrieveData();
            $(containerID).trigger({
                type: "update:Table"
            });
        });
    };

    Table.prototype = {
        retrieveData: function() {
            return this.api.retrieveData(this.endpointName, {});
        }
    };

    return Table;
})();