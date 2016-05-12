/** Class that retrieves JSON responses from Querybuilder.
 * @constructor
 * @param {string} url - URL of JSON API view
 */

QuerybuilderAPI = (function(){
    'use strict';

    var QuerybuilderAPI = function(url) {
        this.url = url;
    };

    QuerybuilderAPI.prototype = {
        retrieveData: function(endpointName, query_config, widget_params, callback) {
            $.ajax({
                url: this.url,
                type: "POST",
                data: {
                    widget_id: endpointName,
                    widget_params: widget_params,
                    query_config: query_config
                },
                success: function(data) {
                    callback(data);
                },
                error: function(request) {
                    console.log(request.responseText);
                }
            });
        }
    };

    return QuerybuilderAPI;
})();
