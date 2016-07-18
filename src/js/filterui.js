var $ = require('jquery');
require('jquery-ui');
require('jquery-deserialize');
require('jquery-ui-timepicker-addon');
var freewall = require('freewall').Freewall;

/** Set of filters.
 * @constructor
 * @param {string} containerID - DOM element ID of the widget
 * @param {string[]} [tabs] -
    list of selectors pointing to divs corresponding to each tab
 */
var FilterForm = (function(){
    'use strict';

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

    var FilterForm = function(containerID, tabs) {

        this.containerID = containerID;

        var that = this;
        var walls = [];

        deserializeForms();
        setSerializationOnChangeEvent();
        addCustomPickers();
        saveReferenceInDOM(that);

        if (tabs && tabs instanceof Array) {
            setFreewall();
            setTabs();
        }

        function getHashString() {
            return window.location.hash.substring(1);
        }

        function deserializeForms() {
            var data = getHashString();
            $('filter-form').find('form').deserialize(data);
        }

        function serializeForms() {
            var nonEmptyInputFields = $("filter-form input").filter(function () {
                return !!this.value;
            });
            var newHash = nonEmptyInputFields.serialize();
            window.location.hash = newHash;
        }

        function setSerializationOnChangeEvent() {
            $(containerID).on("change", function (event) {
                serializeForms();
            });
        }

        function setTabs() {
            $(containerID + '_ff').tabs({
                create: rearrangeAllColumns,
                activate: rearrangeAllColumns
            });
        }

        function rearrangeAllColumns() {
            for (var i in walls) {
                walls[i].fitWidth();
            }
        }

        function setFreewall() {
            for (var idx in tabs) {
                var wall = new freewall(tabs[idx]);
                walls.push(wall);
                wall.reset({
                    selector: '.ff-group',
                    animate: true,
                    cellW: 170,
                    cellH: 'auto',
                    gutterY: 0,
                    onResize: rearrangeAllColumns
                });
                rearrangeAllColumns();
            }
        }

        function saveReferenceInDOM(that) {
            $(containerID).data('FilterForm', that);
        }

        function addCustomPickers() {
            addCustomDatePicker();
            addCustiomTimeDateTimePicker();
            addCustomTimePicker();
        }

        function addCustomDatePicker() {
            var dateFields = getInputFieldsOfType('date');
            dateFields.datepicker(DATE_PICKER_SETTINGS);
            convertInputToTextType(dateFields);
        }

        function addCustiomTimeDateTimePicker() {
            var dateTimeFields = getInputFieldsOfType('datetime-local');
            dateTimeFields.datetimepicker(TIME_PICKER_SETTINGS);
            convertInputToTextType(dateTimeFields);
        }

        function addCustomTimePicker() {
            var timeFields = getInputFieldsOfType('time');
            timeFields.timepicker(TIME_PICKER_SETTINGS);
            convertInputToTextType(timeFields);
        }

        function getInputFieldsOfType(inputType) {
            return $("filter-form").find(getInputTypeSelector(inputType));
        }

        function getInputTypeSelector(inputType) {
            return "input[type='"+ inputType + "']";
        }

        function convertInputToTextType($field) {
            $field.attr('type','text');
        }

    };

    FilterForm.prototype = {
        serialize: function() {
             return $(this.containerID).serialize();
        },
        onSubmit: function(callback) {
            $(this.containerID).on("submit", function(event) {
                event.preventDefault();
                event.stopPropagation();
                callback(event);
            });
        }
    };

    return FilterForm;
})();

module.exports = FilterForm;