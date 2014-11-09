describe('EqualityPredicateFactory', function(){

  it('should return a function', function(){
    var res = App.EqualityPredicateFactory('foo', 'bar');
    expect(typeof res).toEqual('function');
1  });

});