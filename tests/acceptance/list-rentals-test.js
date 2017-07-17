import { test, skip } from 'qunit';
import { makeList, mockQuery, mockFindAll } from 'ember-data-factory-guy'
import moduleForAcceptance from 'mixing-find-all-and-query/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | list rentals');

// this test passes, no problem!
test('should initially show 3 listings.', async function (assert) {
  mockFindAll('rental').returns( {models: makeList('rental', 3) });

  await visit('/');

  assert.equal(find('.listing').length, 3, 'should show 3 listings');
});

// THIS TEST WORKS
test('THIS DOES WORK: it should show 1 listing after filling in input', async function(assert) {

  let seattleRental = makeList('rental', 1, {city: "Seattle"} );
  let otherRentals = makeList('rental', 2);

  // mockQuery('rental'); <-- if mockQuery('rental') comes first, it does not work
  mockQuery('rental', {city: "Seattle"}).returns( {models: seattleRental } );
  mockQuery('rental'); // <-- mockQuery('rental') must come after the line above


  await visit('/');

  await fillIn('.list-filter input', 'Seattle');
  await keyEvent('.list-filter input', 'keyup', 69);

  assert.equal(find('.listing').length, 1, 'should show 1 listing');
  assert.equal(find('.listing .location:contains("Seattle")').length, 1, 'should contain 1 listing with location Seattle');

});

// THIS TEST DOES NOT WORK
test('THIS DOES NOT WORK: it should show 1 listing after filling in input', async function(assert) {
  mockFindAll('rental').returns( {models: makeList('rental', 3) });

  let seattleRental = makeList('rental', 1, {city: "Seattle"} );
  let otherRentals = makeList('rental', 2);
  mockQuery('rental').returns( {models: seattleRental } ).withParams( {city: "Seattle"} );

  await visit('/');

  await fillIn('.list-filter input', 'Seattle');
  await keyEvent('.list-filter input', 'keyup', 69);

  assert.equal(find('.listing').length, 1, 'should show 1 listing');
  assert.equal(find('.listing .location:contains("Seattle")').length, 1, 'should contain 1 listing with location Seattle');

});
