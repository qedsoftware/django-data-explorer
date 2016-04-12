module('application.filterUI', {
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
    FilterForm('#filter', ['#tab_1']);
    $('#filter').trigger("change");
    assert.equal(window.location.hash, '#textField=');
});

test('Serialize form with one field filled test', function(assert) {
    FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    formField.trigger("change");
    assert.equal(window.location.hash, '#textField=someText');
});

test('Serialize same form multiple times test', function(assert) {
    FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    formField.trigger("change");
    formField.trigger("change");
    assert.equal(window.location.hash, '#textField=someText');
});

test('Serialize two empty forms test', function(assert) {
    $('#qunit-fixture').append(secondFormHTML);
    FilterForm('#filter');
    FilterForm('#secondFilter');
    $('#filter').trigger("change");
    $('#secondFilter').trigger("change");
    assert.equal(window.location.hash, '#textField=&textField=');
});

test('Serialize two non-empty forms test', function(assert) {
    $('#qunit-fixture').append(secondFormHTML);
    FilterForm('#filter');
    FilterForm('#secondFilter');
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
    FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    assert.equal(formField.val(), 'someText');
});

test('Deserialize one of two forms test', function(assert) {
    window.location.hash = '#filterID=filter&textField=someText&filterID=filter2&textField=someText';
    FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    assert.equal(formField.val(), 'someText');
});

test('Trigger update event on submit test', function(assert) {
    $('#qunit-fixture').on("update:FilterForm", function(event) {
        assert.ok(true);
    });
    FilterForm('#filter');
    $('#filter').trigger('submit');
});

test('Update event contains form data test', function(assert) {
    $('#qunit-fixture').on("update:FilterForm", function(event) {
        assert.equal(event.formData.length, 1);
        assert.deepEqual(event.formData[0], {
            name: 'textField',
            value: 'someText'
        });
    });
    FilterForm('#filter');
    var formField = $('#filter input[name=textField]');
    formField.val('someText');
    $('#filter').trigger('submit');
});