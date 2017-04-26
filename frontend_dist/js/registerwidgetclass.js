'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerWidgetClassBySelector = undefined;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Register new class of widgets with customized selector.
 * On page load, widgetClass.register will be called on each element matching
 * the selector.
 * @param {string} selector
 * @param widgetClass
 */
function registerWidgetClassBySelector(selector, widgetClass) {
    (0, _jquery2.default)(function () {
        (0, _jquery2.default)(selector).each(function () {
            widgetClass.register(this);
        });
    });
}

/** Register new class of widgets
 * On page load, widgetClass.register will be called on each element that has
 * "data-django-data-explorer-widget" set to attributeValue.
 * @param {string} attributeValue
 * @param widgetClass
 */
function registerWidgetClass(attributeValue, widgetClass) {
    var selector = '[data-django-data-explorer-widget=' + attributeValue + ']';
    registerWidgetClassBySelector(selector, widgetClass);
}

exports.registerWidgetClassBySelector = registerWidgetClassBySelector;
exports.default = registerWidgetClass;