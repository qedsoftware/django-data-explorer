/** Class representing an AJAX datatable.
 * @constructor
 * @param containerID {string} - DOM element ID assigned to the widget
 * @param formID {string} - ID of the FilterForm, optional
 * @param endpointName {string} - name of the widget used for routing requests
 * @param api {QuerybuilderAPI} - data source
 */

Table = (function(){
    'use strict';

    var Table = function(containerID, formID, endpointName, api) {
        this.containerID = containerID;
        this.endpointName = endpointName;
        this.api = api;

        var _this = this;

        $(function () {
            if (!!formID) {
                _this.form = $(formID).data('FilterForm');
                _this.form.onSubmit(function(event) {
                    event.preventDefault();
                    var parameters = _this.form.serialize();
                    $(containerID).data('Table:params', parameters);
                    _this.tableview._fnAjaxUpdate();
                });
            }
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
