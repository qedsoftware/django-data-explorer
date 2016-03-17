module('application.filterUI', {
    beforeEach: function() {
        $('#qunit-fixture').append('<div id="filter"></div>');
    }
});

// Test created to check if karma is properly configured, can be removed later
test('filterUI load test', function(assert) {
    filterUI('#filter');
    assert.ok(true);
});