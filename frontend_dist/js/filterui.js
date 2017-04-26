'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('jquery-ui');

require('jquery-deserialize');

require('jquery-ui-timepicker-addon');

var _freewall = require('freewall');

var _registerwidgetclass = require('./registerwidgetclass');

var _registerwidgetclass2 = _interopRequireDefault(_registerwidgetclass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TIME_PICKER_SETTINGS = {
    showButtonPanel: true,
    controlType: 'select',
    oneLine: true,
    dateFormat: "yy-mm-dd"
};

var DATE_PICKER_SETTINGS = {
    showButtonPanel: true,
    dateFormat: "yy-mm-dd"
};

/** Set of filters.
 * @constructor
 * @param {string} containerID - DOM element ID of the widget
 * @param {string[]} [tabs] -
 list of selectors pointing to divs corresponding to each tab
 */

var FilterForm = function () {
    function FilterForm(containerID, tabs) {
        _classCallCheck(this, FilterForm);

        this.containerID = containerID;
        this.tabs = tabs;
        this.walls = [];
        if (tabs && tabs instanceof Array) {
            this._setFreewall();
            this._setTabs();
        }
        this._deserializeForms();
        this._setSerializationOnChangeEvent();
        this._addCustomPickers();
        this._saveReferenceInDOM();
    }

    _createClass(FilterForm, [{
        key: 'serialize',
        value: function serialize() {
            return (0, _jquery2.default)(this.containerID).serialize();
        }
    }, {
        key: 'onSubmit',
        value: function onSubmit(callback) {
            (0, _jquery2.default)(this.containerID).on("submit", function (event) {
                event.preventDefault();
                event.stopPropagation();
                callback(event);
            });
        }
    }, {
        key: '_getHashString',
        value: function _getHashString() {
            return window.location.hash.substring(1);
        }
    }, {
        key: '_deserializeForms',
        value: function _deserializeForms() {
            var data = this._getHashString();
            (0, _jquery2.default)('filter-form').find('form').deserialize(data);
        }
    }, {
        key: '_serializeForms',
        value: function _serializeForms() {
            var nonEmptyInputFields = (0, _jquery2.default)("filter-form input").filter(function () {
                return !!this.value;
            });
            var newHash = nonEmptyInputFields.serialize();
            window.location.hash = newHash;
        }
    }, {
        key: '_setSerializationOnChangeEvent',
        value: function _setSerializationOnChangeEvent() {
            var _this = this;

            (0, _jquery2.default)(this.containerID).on("change", function () {
                _this._serializeForms();
            });
        }
    }, {
        key: '_setTabs',
        value: function _setTabs() {
            if (this.tabs.length <= 1) {
                return;
            }
            (0, _jquery2.default)(this.containerID + '_ff').tabs({
                create: this._rearrangeAllColumns.bind(this),
                activate: this._rearrangeAllColumns.bind(this)
            });
        }
    }, {
        key: '_rearrangeAllColumns',
        value: function _rearrangeAllColumns() {
            this.walls.forEach(function (wall) {
                return wall.fitWidth();
            });
        }
    }, {
        key: '_setFreewall',
        value: function _setFreewall() {
            var _this2 = this;

            this.tabs.forEach(function (tab) {
                var wall = new _freewall.freewall(tab);
                _this2.walls.push(wall);
                wall.reset({
                    selector: '.ff-group',
                    animate: true,
                    cellW: 170,
                    cellH: 'auto',
                    gutterY: 0,
                    onResize: _this2._rearrangeAllColumns.bind(_this2)
                });
                _this2._rearrangeAllColumns();
            });
        }
    }, {
        key: '_saveReferenceInDOM',
        value: function _saveReferenceInDOM() {
            (0, _jquery2.default)(this.containerID).data('FilterForm', this);
        }
    }, {
        key: '_addCustomPickers',
        value: function _addCustomPickers() {
            this._addCustomDatePicker();
            this._addCustiomTimeDateTimePicker();
            this._addCustomTimePicker();
        }
    }, {
        key: '_addCustomDatePicker',
        value: function _addCustomDatePicker() {
            var dateFields = this._getInputFieldsOfType('date');
            dateFields.datepicker(DATE_PICKER_SETTINGS);
            this._convertInputToTextType(dateFields);
        }
    }, {
        key: '_addCustiomTimeDateTimePicker',
        value: function _addCustiomTimeDateTimePicker() {
            var dateTimeFields = this._getInputFieldsOfType('datetime-local');
            dateTimeFields.datetimepicker(TIME_PICKER_SETTINGS);
            this._convertInputToTextType(dateTimeFields);
        }
    }, {
        key: '_addCustomTimePicker',
        value: function _addCustomTimePicker() {
            var timeFields = this._getInputFieldsOfType('time');
            timeFields.timepicker(TIME_PICKER_SETTINGS);
            this._convertInputToTextType(timeFields);
        }
    }, {
        key: '_getInputFieldsOfType',
        value: function _getInputFieldsOfType(inputType) {
            return (0, _jquery2.default)("filter-form").find(this._getInputTypeSelector(inputType));
        }
    }, {
        key: '_getInputTypeSelector',
        value: function _getInputTypeSelector(inputType) {
            return "input[type='" + inputType + "']";
        }
    }, {
        key: '_convertInputToTextType',
        value: function _convertInputToTextType($field) {
            $field.attr('type', 'text');
        }
    }], [{
        key: 'register',
        value: function register(element) {
            return new FilterForm('#' + element.id, ['#tab']);
        }
    }]);

    return FilterForm;
}();

(0, _registerwidgetclass2.default)("filter-form", FilterForm);

exports.default = FilterForm;