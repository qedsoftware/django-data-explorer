import { FilterForm } from '../../frontend_dist/js/app.js';
import $ from 'jquery';

$(() => {
    let form = new FilterForm('#filter', ['#tab_1', "#tab_2"]);
    $("#filter").on("submit", function(event) {
        event.preventDefault();
        console.log(form.serialize());
    });
});
