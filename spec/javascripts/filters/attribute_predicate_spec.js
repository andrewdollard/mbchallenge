describe('AttributePredicateFactory', function(){

  it('should return a function', function(){
    var res = App.AttributePredicateFactory('foo', 'bar');
    expect(typeof res).toEqual('function');
  });

});