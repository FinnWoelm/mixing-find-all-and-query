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
        //return [{title: "Hey", city: "B"}]

        return this.get('store').findAll('rental');
      }
    }
  }
});
