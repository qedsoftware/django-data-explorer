import $ from 'jquery';
import datatableview from './datatableview';

if (datatableview.auto_initialize) {
    datatableview.initialize($('.datatable'));
}

/** Class representing an AJAX datatable.
 * @constructor
 * @param containerID {string} - DOM element ID assigned to the widget
 * @param formID {string} - ID of the FilterForm, optional
 * @param endpointName {string} - name of the widget used for routing requests
 * @param api {QuerybuilderAPI} - data source
 * @param widgetParams {string} - manually defined data that will be passed
 to the API together with the request
 */
class Table {
    constructor(containerID, formID, endpointName, api, widgetParams) {
        this.containerID = containerID;
        this.endpointName = endpointName;
        this.api = api;
        this.widgetParams = widgetParams;
        this.form = null;
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
            this.form.onSubmit(this._getData.bind(this));
        }
    }

    _getFilterForm(formID) {
        return $(formID).data('FilterForm');
    }

    _getData(event) {
        event.preventDefault();
        var parameters = this.form.serialize();
        $(this.containerID).data('Table:client_params', parameters);
        $(this.containerID).data('Table:widget_params', this.widgetParams);
        this.tableview._fnAjaxUpdate();
    }

    _storeTableInDOM() {
        $(this.containerID).data('Table', this);
        $(this.containerID).data('Table:widget_params', this.widgetParams);
    }

    _initializeTableView() {
        this.tableview = datatableview.initialize($(this.containerID + '_t'), {
            tableID: this.containerID,
            endpointName: this.endpointName,
            initComplete: this._initSubmit
        });
    }

    _initSubmit() {
        if (this.formID && this.tableview) {
            $(this.formID).trigger("submit");
        }
    }

}

export default Table;