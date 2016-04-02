Table = (function(){
    'use strict';

    var Table = function(containerID, formID, endpointName, api) {
        this.containerID = containerID;
        this.formID = formID;
        this.endpointName = endpointName;
        this.api = api;

        var _this = this;
        $(this.formID).on("update:FilterForm", function(event) {
            var data = _this.retrieveData();
            $(containerID).trigger({
                type: "update:Table"
            });
        });
    }

    Table.prototype = {
        retrieveData: function() {
            return this.api.retrieveData(this.endpointName, {});
        }
    };

    return Table;
})();