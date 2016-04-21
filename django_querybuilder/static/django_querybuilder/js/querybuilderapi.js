QuerybuilderAPI = (function(){
    'use strict';

    var QuerybuilderAPI = function(url) {
        this.url = url
    }

    QuerybuilderAPI.prototype = {
        retrieveData: function(endpointName, parameters, callback) {
            $.ajax({
                url: this.url,
                type: "POST",
                data: {widget_id: endpointName, query_config: parameters},
                success: function(data) {
                    callback(data);
                },
                error: function(request) {
                    console.log(request.responseText);
                }
            });
        }
    }

    return QuerybuilderAPI;
})();
