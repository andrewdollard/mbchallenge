describe('App.EventFilter', function(){

  describe('filter()', function(){
    var events = new App.EventCollection([
      {age: 25, gender: 'male'},
      {age: 35, gender: 'female'},
      {age: 45, gender: 'male'},
      {age: 55, gender: 'female'}
    ]);

    var genderPredicate = App.EqualityPredicateFactory('gender', 'male');
    var agePredicate = App.RangePredicateFactory('age', 20, 30);

    it('should return events that pass a given predicate', function(){
      var filtered = new App.EventFilter(events)
                            .addPredicate(genderPredicate)
                            .filter();

      var result = filtered.map(function(m){ return m.attributes; });
      expect(result).toEqual([ {age: 25, gender: 'male'}, {age: 45, gender: 'male'} ]);
    });

    it('should require all set predicates', function(){
      var filtered = new App.EventFilter(events)
                          .addPredicate(genderPredicate)
                          .addPredicate(agePredicate)
                          .filter();

      var result = filtered.map(function(m){ return m.attributes; });
      expect(result).toEqual([ {age: 25, gender: 'male'} ]);
    });

  });

});