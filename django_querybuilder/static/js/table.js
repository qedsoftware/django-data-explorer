Table = (function(){
    'use strict';

    var Table = function(containerID, formID) {
        this.containerID = containerID;
        this.formID = formID;

        $(this.formID).on("update:FilterForm", function(event) {
            $(containerID).trigger({
                type: "update:Table"
            });
        });
    }

    return Table;
})();