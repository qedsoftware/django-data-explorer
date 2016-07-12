var QUnit = require('qunitjs');
var FilterForm = require('../../django_querybuilder/static/django_querybuilder/js/filterui');

QUnit.module('application.filterUI', {
    beforeEach: function() {
        $('#qunit-fixture').append(firstFormHTML);
    },
    afterEach: function() {
        cleanHash();
    }
});

var firstFormHTML =
    '<filter-form id="filter_ff">' +
        '<form id="filter">' +
            '<ul class="ff-tabs-list">' +
                '<li><a href="#tab_1">Tab 1</a></li>' +
            '</ul>' +
            '<div class="ff-tab-pane" id="tab_1">' +
                '<div class="ff-group">' +
                    '<input type="text" name="textField">' +
                '</div>' +
                '<div class="ff-footer">' +
                    '<input class="ff-sumbit" type="submit">' +
                '</div>' +
            '</div>' +
        '</form>' +
    '</filter-form>';

var secondFormHTML =
    '<filter-form>' +
        '<form id="secondFilter">' +
            '<input type="text" name="textField">' +
            '<input type="submit"' +
        '</form>' +
    '</filter-form>';


function cleanHash() {
    window.location.hash = '';
}

test('Serialize form with no input test', function(assert) {
    new FilterForm('#filter', ['#tab_1']);
    $('#filter').trigger("change");
    assert.equal(window.location.hash, '');
});

test('Serialize form with one field filled test', function(assert) {
    new FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    formField.trigger("change");
    assert.equal(window.location.hash, '#textField=someText');
});

test('Serialize same form multiple times test', function(assert) {
    new FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    formField.trigger("change");
    formField.trigger("change");
    assert.equal(window.location.hash, '#textField=someText');
});

test('Serialize two non-empty forms test', function(assert) {
    $('#qunit-fixture').append(secondFormHTML);
    new FilterForm('#filter');
    new FilterForm('#secondFilter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    formField.trigger("change");
    var secondFormField = $('#secondFilter input[name=textField]');
    secondFormField.val('someText');
    secondFormField.trigger("change");
    assert.equal(window.location.hash, '#textField=someText&textField=someText');
});

test('Deserialize single form test', function(assert) {
    window.location.hash = '#filterID=filter&textField=someText';
    new FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    assert.equal(formField.val(), 'someText');
});

test('Deserialize one of two forms test', function(assert) {
    window.location.hash = '#filterID=filter&textField=someText&filterID=filter2&textField=someText';
    new FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    assert.equal(formField.val(), 'someText');
});

test('Serialize returns form data test', function(assert) {
    $('#qunit-fixture').on("submit", function(event) {
        event.preventDefault();
        assert.deepEqual(form.serialize(), 'textField=someText');
    });
    var form = new FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    $('#filter').trigger('submit');
});

test('Submit event calls callback function test', function(assert) {
    var form = new FilterForm('#filter');
    form.onSubmit(function(event) {
        event.preventDefault();
        assert.ok(true);
    });
    $('#filter').trigger('submit');
});

test('Reference is stored in the DOM test', function (assert) {
    var form = new FilterForm('#filter');
    var loadedForm = $('#filter').data('FilterForm');
    assert.equal(form, loadedForm);
});