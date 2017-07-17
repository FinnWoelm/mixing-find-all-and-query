import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('rental', {
  default: {
    title:        (f)=> `Rental Property #${f.id}`,
    city:         (f)=> `City #${f.id}`
  }
});
