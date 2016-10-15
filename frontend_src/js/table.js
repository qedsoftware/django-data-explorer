import $ from 'jquery';

import datatableview from './datatableview';
import DataExplorerAPI from './dataexplorerapi';
import registerWidgetClass from './registerwidgetclass';

if (datatableview.auto_initialize) {
    datatableview.initialize($('.datatable'));
}

/** Class representing an AJAX datatable.
 * @constructor
 * @param containerID {string} - DOM element ID assigned to the widget
 * @param formID {string} - ID of the FilterForm, optional
 * @param endpointName {string} - name of the widget used for routing requests
 * @param api {DataExplorerAPI} - data source
 * @param widgetParams {string} - manually defined data that will be passed
 to the API together with the request
 */
class Table {
    constructor(containerID, formID, endpointName, api, widgetParams) {
        this.containerID = containerID;
        this.endpointName = endpointName;
        this.api = api;
        this.widgetParams = widgetParams;
        this.formID = formID;
        this._linkWithFilterForm(formID);
        this._storeTableInDOM();
        this._initializeTableView();
    }

    retrieveData(client_params, widget_params, callback) {
        this.api.retrieveData(this.endpointName, client_params, widget_params, callback);
    }

    _linkWithFilterForm(formID) {
        if (formID) {
            this.form = this._getFilterForm(formID);
            this.form.onSubmit(this._refreshData.bind(this));
        }
    }

    _getFilterForm(formID) {
        return $(formID).data('FilterForm');
    }

    _refreshData(event) {
        event.preventDefault();
        this.tableview._fnAjaxUpdate();
    }

    _getFilterParameters() {
        if (this.form) {
            return this.form.serialize();
        } else {
            return '';
        }
    }

    _storeTableInDOM() {
        $(this.containerID).data('Table', this);
    }

    _initializeTableView() {
        this.tableview = datatableview.initialize($(this.containerID + '_t'), {
            tableID: this.containerID,
            endpointName: this.endpointName,
            initComplete: this._initSubmit.bind(this)
        });
    }

    _initSubmit() {
        if (this.formID && this.tableview) {
            $(this.formID).trigger("submit");
        }
    }

    static register(element) {
        var tableData = $(element).data("django-data-explorer-table");
        var api = new DataExplorerAPI(tableData.endpointUrl);
        return new Table(tableData.containerID, tableData.formID, tableData.endpointName,
            api, tableData.params);
    }

}

registerWidgetClass("table", Table);

export default Table;
