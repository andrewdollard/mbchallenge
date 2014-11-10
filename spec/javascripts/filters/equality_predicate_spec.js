describe('EqualityPredicate', function(){

  describe('Factory', function(){

    it('should return a function', function(){
      var res = App.EqualityPredicateFactory('foo', 'bar');
      expect(typeof res).toEqual('function');
    });

  });

});