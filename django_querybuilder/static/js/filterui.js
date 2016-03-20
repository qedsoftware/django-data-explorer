FilterForm = function(containerID) {
    $(function() {

        deserializeForms();
        setSerializationOnChangeEvent();
        setSubmitEvent();

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
    });
};