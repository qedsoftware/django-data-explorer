"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class that retrieves JSON responses from Data Explorer.
 * @constructor
 * @param {string} url - URL of JSON API view
 */
var DataExplorerAPI = function () {
    function DataExplorerAPI(url) {
        _classCallCheck(this, DataExplorerAPI);

        this.url = url;
    }

    _createClass(DataExplorerAPI, [{
        key: "retrieveData",
        value: function retrieveData(endpointName, client_params, widget_params, callback) {
            _jquery2.default.ajax({
                url: this.url,
                type: "POST",
                data: {
                    widget_id: endpointName,
                    widget_params: widget_params,
                    client_params: client_params
                },
                success: function success(data) {
                    callback(data);
                },
                error: function error(request) {
                    console.log(request.responseText); // eslint-disable-line no-console
                }
            });
        }
    }]);

    return DataExplorerAPI;
}();

exports.default = DataExplorerAPI;