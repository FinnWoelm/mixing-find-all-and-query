# mixing-find-all-and-query


## Installation

* `git clone <repository-url>` this repository
* `cd mixing-find-all-and-query`
* `npm install`

~~~
$ ember -v
ember-cli: 2.14.0
node: 6.11.1
os: linux x64
~~~

## What This App Is

The app is a simple list of rentals with two properties: title and city.

On app load, the entire list is displayed.

The user can use the input element on top to filter rentals by city. In the example set up here, typing 'sf' will show properties 4 and 5 and typing 'nyc' will show properties 1, 2, and 3. Try it out (it uses ember-data-factory-guy scenarios to generate the data).

Now, when testing this. The following test **fails**:

~~~javascript
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
~~~

It fails because it expects 1 listing, but 3 are shown. Why is this? Because for some reason, factory guy mocks the call `this.get('store').query('rental', { city: param })` with the mockFindAll() set up in the first line of the test.

You can check this for yourself by having a look at the file app/controllers/rentals.js:

~~~javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    filterByCity(param) {
      console.log(param);
      if (param !== '') {
        console.log("Querying...");
        return this.get('store').query('rental', { city: param });
      } else {
        console.log("Finding all...")
        return this.get('store').findAll('rental');
      }
    }
  }
});
~~~

This function (`filterByCity()`) is called when the user changes the text in the input. If there is no text in the input, store calls findAll(). If there is text, story calls query(). We know that the correct store method is called because console log shows:

~~~javascript
Seattle
Querying...
[factory-guy] MockFindAll(rental) Object { data: Array[3] } // <-- this should be [factory-guy] MockQuery(rental) Object { data: Array[1] }
~~~


Interestingly, it all works when mockFindAll('rental') is replaced by query('rental') in the test and when the specific query('rental', { city: "Seattle"} ) **comes before** the general query('rental'). 
