FilterForm = function(containerID, tabs) {
    'use strict';
    $(function() {

        deserializeForms();
        setSerializationOnChangeEvent();
        setSubmitEvent();
        if (tabs && tabs instanceof Array) {
            setTabs();
            setFreewall();
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
            $(containerID + '_ff').tabs();
        }

        function setFreewall() {
            for (var idx in tabs) {
                var wall = new freewall(tabs[idx]);
                wall.reset({
                    selector: '.ff-group',
                    animate: true,
                    cellW: 250,
                    cellH: 'auto',
                    onResize: function() {
                        wall.fitWidth();
                    }
                });
                wall.fitWidth();
            }

        }
    });
};