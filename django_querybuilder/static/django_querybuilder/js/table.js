/** Class representing an AJAX datatable.
 * @constructor
 * @param containerID {string} - DOM element ID assigned to the widget
 * @param formID {string} - ID of the FilterForm, optional
 * @param endpointName {string} - name of the widget used for routing requests
 * @param api {QuerybuilderAPI} - data source
 * @param widgetParams {string} - manually defined data that will be passed
    to the API together with the request
 */

Table = (function(){
    'use strict';

    var Table = function(containerID, formID, endpointName, api, widgetParams) {
        this.containerID = containerID;
        this.endpointName = endpointName;
        this.api = api;
        this.widgetParams = widgetParams;

        var _this = this;

        $(function () {
            linkWithFilterForm(formID);
            storeTableInDOM();
            initializeTableView();
        });

        function linkWithFilterForm(formID) {
            if (!!formID) {
                _this.form = getFilterForm(formID);
                _this.form.onSubmit(getData);
            }
        }

        function getFilterForm(formID) {
            return $(formID).data('FilterForm');
        }

        function getData(event) {
            event.preventDefault();
            var parameters = _this.form.serialize();
            $(containerID).data('Table:query_config', parameters);
            $(containerID).data('Table:widget_params', _this.widgetParams);
            _this.tableview._fnAjaxUpdate();
        }

        function storeTableInDOM() {
            $(containerID).data('Table', _this);
            $(containerID).data('Table:widget_params', _this.widgetParams);
        }

        function initializeTableView() {
            _this.tableview = datatableview.initialize($(containerID + '_t'), {
                tableID: containerID,
                endpointName: endpointName,
                initComplete: initSubmit
            });
        }

        function initSubmit() {
            if (!!formID && _this.tableview) {
                $(formID).trigger("submit");
            }
        }
    };

    Table.prototype = {
        retrieveData: function(query_config, widget_params, callback) {
            this.api.retrieveData(this.endpointName, query_config, widget_params, callback);
        }
    };

    return Table;
})();
