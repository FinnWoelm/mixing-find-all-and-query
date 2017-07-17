import { Scenario } from 'ember-data-factory-guy';

Scenario.settings({
  logLevel: 1, // Change log level to 1 to see all output
});

// for testing in dev environment
export default class extends Scenario {
  run() {
    let nyc_rentals = this.makeList('rental', 3, { city: 'New York'} )
    let sf_rentals  = this.makeList('rental', 2, { city: 'San Francisco'} )

    this.mockQuery('rental').returns( {models: nyc_rentals } ).withSomeParams({city:'nyc'});
    this.mockQuery('rental', {city:'sf'} ).returns( {models: sf_rentals } )
    this.mockQuery('rental')
  }
}
