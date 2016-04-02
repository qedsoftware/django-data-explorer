QuerybuilderAPI = (function(){
    'use strict';

    var QuerybuilderAPI = function() {
    }

    QuerybuilderAPI.prototype = {
        retrieveData: function(endpointName, parameters) {
            return {
                status: 'OK',
                data: [
                    {'name': 'Vachellia tortilis', 'height': 21},
                    {'name': 'Pinus nigra', 'height': 55}
                ]
            };
        }
    }

    return QuerybuilderAPI;
})();