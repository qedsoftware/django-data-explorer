Table = (function(){
    'use strict';

    var Table = function(containerID, formID, endpointName, api) {
        this.containerID = containerID;
        this.form = $(formID).data('FilterForm');
        this.endpointName = endpointName;
        this.api = api;

        var _this = this;
        if (!!formID) {
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
        }
        $(function () {
            $(containerID).data('Table', _this);
            datatableview.initialize($(containerID + '_t'), {
                tableID: containerID,
                endpointName: endpointName
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
