import $ from 'jquery';
import 'jquery-ui';
import 'jquery-deserialize';
import 'jquery-ui-timepicker-addon';
import { freewall as Freewall } from 'freewall';

const TIME_PICKER_SETTINGS = {
    showButtonPanel: true,
    controlType: 'select',
    oneLine: true,
    dateFormat: "yy-mm-dd"
};

const DATE_PICKER_SETTINGS = {
    showButtonPanel: true,
    dateFormat: "yy-mm-dd"
};

/** Set of filters.
 * @constructor
 * @param {string} containerID - DOM element ID of the widget
 * @param {string[]} [tabs] -
 list of selectors pointing to divs corresponding to each tab
 */
class FilterForm {

    constructor(containerID, tabs) {
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

    serialize() {
        return $(this.containerID).serialize();
    }

    onSubmit(callback) {
        $(this.containerID).on("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            callback(event);
        });
    }

    _getHashString() {
        return window.location.hash.substring(1);
    }

    _deserializeForms() {
        var data = this._getHashString();
        $('filter-form').find('form').deserialize(data);
    }

    _serializeForms() {
        var nonEmptyInputFields = $("filter-form input").filter(function () {
            return !!this.value;
        });
        var newHash = nonEmptyInputFields.serialize();
        window.location.hash = newHash;
    }

    _setSerializationOnChangeEvent() {
        $(this.containerID).on("change", () => {
            this._serializeForms();
        });
    }

    _setTabs() {
        $(this.containerID + '_ff').tabs({
            create: this._rearrangeAllColumns,
            activate: this._rearrangeAllColumns
        });
    }

    _rearrangeAllColumns() {
        for (var i in this.walls) {
            this.walls[i].fitWidth();
        }
    }

    _setFreewall() {
        for (var idx in this.tabs) {
            var wall = new Freewall(this.tabs[idx]);
            this.walls.push(wall);
            wall.reset({
                selector: '.ff-group',
                animate: true,
                cellW: 170,
                cellH: 'auto',
                gutterY: 0,
                onResize: this._rearrangeAllColumns
            });
            this._rearrangeAllColumns();
        }
    }

    _saveReferenceInDOM() {
        $(this.containerID).data('FilterForm', this);
    }

    _addCustomPickers() {
        this._addCustomDatePicker();
        this._addCustiomTimeDateTimePicker();
        this._addCustomTimePicker();
    }

    _addCustomDatePicker() {
        var dateFields = this._getInputFieldsOfType('date');
        dateFields.datepicker(DATE_PICKER_SETTINGS);
        this._convertInputToTextType(dateFields);
    }

    _addCustiomTimeDateTimePicker() {
        var dateTimeFields = this._getInputFieldsOfType('datetime-local');
        dateTimeFields.datetimepicker(TIME_PICKER_SETTINGS);
        this._convertInputToTextType(dateTimeFields);
    }

    _addCustomTimePicker() {
        var timeFields = this._getInputFieldsOfType('time');
        timeFields.timepicker(TIME_PICKER_SETTINGS);
        this._convertInputToTextType(timeFields);
    }

    _getInputFieldsOfType(inputType) {
        return $("filter-form").find(this._getInputTypeSelector(inputType));
    }

    _getInputTypeSelector(inputType) {
        return "input[type='" + inputType + "']";
    }

    _convertInputToTextType($field) {
        $field.attr('type', 'text');
    }

}

export default FilterForm;