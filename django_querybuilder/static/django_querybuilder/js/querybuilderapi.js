var $ = require('jquery');

/** Class that retrieves JSON responses from Querybuilder.
 * @constructor
 * @param {string} url - URL of JSON API view
 */

var QuerybuilderAPI = (function(){
    'use strict';

    var QuerybuilderAPI = function(url) {
        this.url = url;
    };

    QuerybuilderAPI.prototype = {
        retrieveData: function(endpointName, client_params, widget_params, callback) {
            $.ajax({
                url: this.url,
                type: "POST",
                data: {
                    widget_id: endpointName,
                    widget_params: widget_params,
                    client_params: client_params,
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

module.exports = QuerybuilderAPI;