import $ from 'jquery';

/** Register new class of widgets with customized selector.
 * On page load, widgetClass.register will be called on each element matching
 * the selector.
 * @param {string} selector
 * @param widgetClass
 */
function registerWidgetClassBySelector(selector, widgetClass) {
    $(() => {
        $(selector).each(function() {
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
    let selector = `[data-django-data-explorer-widget=${attributeValue}]`;
    registerWidgetClassBySelector(selector, widgetClass);
}

export { registerWidgetClassBySelector };
export default registerWidgetClass;
