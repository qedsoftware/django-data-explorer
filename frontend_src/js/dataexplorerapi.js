import $ from 'jquery';

/** Class that retrieves JSON responses from Data Explorer.
 * @constructor
 * @param {string} url - URL of JSON API view
 */
class DataExplorerAPI {

    constructor(url) {
        this.url = url;
    }

    retrieveData(endpointName, client_params, widget_params, callback) {
        $.ajax({
            url: this.url,
            type: "POST",
            data: {
                widget_id: endpointName,
                widget_params,
                client_params
            },
            success: (data) => {
                callback(data);
            },
            error: (request) => {
                console.log(request.responseText); // eslint-disable-line no-console
            }
        });
    }
}

export default DataExplorerAPI;
