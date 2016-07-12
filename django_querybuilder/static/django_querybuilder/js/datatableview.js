var $ = require('jquery');
var Cookie = require('js-cookie');
require('datatables');

/* Modified version of datatableviw.js from datatable. */

var datatableview = {
    auto_initialize: false,
    defaults: {
        "bPaginate": true,
        "bServerSide": true,
    },

    getCookie: function(name) {
        return Cookie.get(name);
    },

    initialize: function($$, opts) {
        if (typeof window.console === "undefined" || typeof window.console.log === "undefined") {
            console = {
                log: function(){},
                info: function(){}
            };
        }
        var options_name_map = {
            'config-sortable': 'bSortable',
            'config-sorting': 'aaSorting',
            'config-visible': 'bVisible'
        };

        var template_clear_button = $('<a href="#" class="clear-search">Clear</a>');

        var initialized_datatables = [];
        $$.each(function(){
            var datatable = $(this);
            var column_options = [];
            var sorting_options = [];

            datatable.find('thead th').each(function(){
                var header = $(this);
                datatableview.options = {};
                for (var i = 0; i < header[0].attributes.length; i++) {
                    var attr = header[0].attributes[i];
                    if (attr.specified && /^data-/.test(attr.name)) {
                        var name = attr.name.replace(/^data-/, '');
                        var value = attr.value;

                        // Typecasting out of string
                        name = options_name_map[name];
                        if (/^b/.test(name)) {
                            value = (value === 'true');
                        }

                        if (name == 'aaSorting') {
                            // This doesn't go in the column_options
                            var sort_info = value.split(',');
                            sort_info[1] = parseInt(sort_info[1]);
                            sorting_options.push(sort_info);
                            continue;
                        }

                        datatableview.options[name] = value;
                    }
                }
                column_options.push(datatableview.options);
            });

            // Arrange the sorting column requests and strip the priority information
            sorting_options.sort(function(a, b){ return a[0] - b[0]; });
            for (var i = 0; i < sorting_options.length; i++) {
                sorting_options[i] = sorting_options[i].slice(1);
            }

            var sEcho_count = 0;
            datatableview.options = $.extend({}, datatableview.defaults, opts, {
                "aaSorting": sorting_options,
                "aoColumns": column_options,
                "ajax": function (data, callback, settings) {
                    var table = $(opts.tableID).data('Table');
                    var client_params = $(opts.tableID).data('Table:client_params');
                    var table_params = {
                        filter_query: client_params,
                        datatables_params: {
                            iDisplayStart: data.start,
                            iDisplayLength: data.length,
                            sEcho: sEcho_count++
                        },
                    };
                    $.extend(table_params.datatables_params, get_ordering_params(data.order));
                    var widget_params = $(opts.tableID).data('Table:widget_params');
                    var table_params_string = JSON.stringify(table_params);
                    table.retrieveData(table_params_string, widget_params, function(response) {
                        callback({data: response.data.aaData,
                                  recordsTotal: response.data.iTotalRecords,
                                  recordsFiltered: response.data.iTotalDisplayRecords});
                    });
                },
                "iDisplayLength": datatable.attr('data-page-length'),
                "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre){
                    $("#" + datatable.attr('data-result-counter-id')).html(parseInt(iTotal).toLocaleString());
                    var infoString = oSettings.oLanguage.sInfo.replace('_START_',iStart).replace('_END_',iEnd).replace('_TOTAL_',iTotal);
                    if (iMax != iTotal) {
                        infoString += oSettings.oLanguage.sInfoFiltered.replace('_MAX_',iMax);
                    }
                    return infoString;
                },
                "bFilter": false
            });
            try {
                datatableview.options = confirm_datatable_options(datatableview.options, datatable);
            } catch (e) {

            }

            var initialized_datatable = datatable.dataTable(datatableview.options);
            initialized_datatables.push(initialized_datatable[0]);

            try {
                initialized_datatable.fnSetFilteringDelay();
            } catch (e) {
                console.info("datatable plugin fnSetFilteringDelay not available");
            }

            var search_input = initialized_datatable.closest('.dataTables_wrapper').find('.dataTables_filter input');
            var clear_button = template_clear_button.clone().click(function(){
                $(this).trigger('clear.datatable', [initialized_datatable]);
                return false;
            }).bind('clear.datatable', function(){
                search_input.val('').keyup();
            });
            search_input.after(clear_button).after(' ');
        });
        return $(initialized_datatables).dataTable();
    }
};

function get_ordering_params(order_data) {
    if (order_data.length > 1)
        console.warn("Multiple columns ordering not supported");
    if (order_data.length > 0) {
        return {
            iSortingCols: order_data.length,
            iSortCol_0: order_data[0].column,
            sSortDir_0: order_data[0].dir,
        };
    }
    else return { iSortingCols: 0 };
}

module.exports = datatableview;