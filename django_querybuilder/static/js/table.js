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
                $(containerID).data('Table:params', parameters);
                _this.tableview._fnAjaxUpdate();
            });
        }
        $(function () {
            $(containerID).data('Table', _this);
            _this.tableview = datatableview.initialize($(containerID + '_t'), {
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
