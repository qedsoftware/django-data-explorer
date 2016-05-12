/** Set of filters.
 * @constructor
 * @param {string} containerID - DOM element ID of the widget
 * @param {string[]} [tabs] -
    list of selectors pointing to divs corresponding to each tab
 */
FilterForm = (function(){
    'use strict';

    var FilterForm = function(containerID, tabs) {

        this.containerID = containerID;

        var that = this;

        $(function () {
            var walls = [];

            deserializeForms();
            setSerializationOnChangeEvent();
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
        });

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
