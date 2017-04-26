'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _datatableview = require('./datatableview');

var _datatableview2 = _interopRequireDefault(_datatableview);

var _dataexplorerapi = require('./dataexplorerapi');

var _dataexplorerapi2 = _interopRequireDefault(_dataexplorerapi);

var _registerwidgetclass = require('./registerwidgetclass');

var _registerwidgetclass2 = _interopRequireDefault(_registerwidgetclass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (_datatableview2.default.auto_initialize) {
    _datatableview2.default.initialize((0, _jquery2.default)('.datatable'));
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

var Table = function () {
    function Table(containerID, formID, endpointName, api, widgetParams) {
        _classCallCheck(this, Table);

        this.containerID = containerID;
        this.endpointName = endpointName;
        this.api = api;
        this.widgetParams = widgetParams;
        this.formID = formID;
        this._linkWithFilterForm(formID);
        this._storeTableInDOM();
        this._initializeTableView();
    }

    _createClass(Table, [{
        key: 'retrieveData',
        value: function retrieveData(client_params, widget_params, callback) {
            this.api.retrieveData(this.endpointName, client_params, widget_params, callback);
        }
    }, {
        key: '_linkWithFilterForm',
        value: function _linkWithFilterForm(formID) {
            if (formID) {
                this.form = this._getFilterForm(formID);
                this.form.onSubmit(this._refreshData.bind(this));
            }
        }
    }, {
        key: '_getFilterForm',
        value: function _getFilterForm(formID) {
            return (0, _jquery2.default)(formID).data('FilterForm');
        }
    }, {
        key: '_refreshData',
        value: function _refreshData(event) {
            event.preventDefault();
            this.tableview._fnAjaxUpdate();
        }
    }, {
        key: '_getFilterParameters',
        value: function _getFilterParameters() {
            if (this.form) {
                return this.form.serialize();
            } else {
                return '';
            }
        }
    }, {
        key: '_storeTableInDOM',
        value: function _storeTableInDOM() {
            (0, _jquery2.default)(this.containerID).data('Table', this);
        }
    }, {
        key: '_initializeTableView',
        value: function _initializeTableView() {
            this.tableview = _datatableview2.default.initialize((0, _jquery2.default)(this.containerID + '_t'), {
                tableID: this.containerID,
                endpointName: this.endpointName,
                initComplete: this._initSubmit.bind(this)
            });
        }
    }, {
        key: '_initSubmit',
        value: function _initSubmit() {
            if (this.formID && this.tableview) {
                (0, _jquery2.default)(this.formID).trigger("submit");
            }
        }
    }], [{
        key: 'register',
        value: function register(element) {
            var tableData = (0, _jquery2.default)(element).data("django-data-explorer-table");
            var api = new _dataexplorerapi2.default(tableData.endpointUrl);
            return new Table(tableData.containerID, tableData.formID, tableData.endpointName, api, tableData.params);
        }
    }]);

    return Table;
}();

(0, _registerwidgetclass2.default)("table", Table);

exports.default = Table;