FilterForm = function(containerID, tabs) {
    'use strict';
    $(function() {

        var walls = [];

        deserializeForms();
        setSerializationOnChangeEvent();
        setSubmitEvent();
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
            var newHash = $('filter-form').find('form').serialize();
            window.location.hash = newHash;
        }

        function setSerializationOnChangeEvent() {
            $(containerID).on("change", function(event) {
                serializeForms();
            });
        }

        function setSubmitEvent() {
            $(containerID).on(
                "submit",
                function(event) {
                    event.preventDefault();
                    $(this).trigger({
                        type: "update:FilterForm",
                        formData: $(this).serializeArray()
                    });
                }
            );
        }

        function setTabs() {
            $(containerID + '_ff').tabs({
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
    });
};