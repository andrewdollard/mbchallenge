describe('equality predicate', function(){
  var predicate = App.EqualityPredicateFactory('device', 'mobile');

  it('should be a function', function(){
    expect(typeof predicate).toEqual('function');
  });

  it('should return true if the objects attribute is equal to the supplied value', function(){
    var equalEvent = new App.Event({'device': 'mobile'});
    expect(predicate(equalEvent)).toBeTruthy();
  });

  it('should return false if the objects attribute is not equal to the supplied value', function(){
    var unEqualEvent = new App.Event({'device': 'tablet'});
    expect(predicate(unEqualEvent)).toBeFalsy();
  });

});

describe('range predicate', function(){
  var predicate = App.RangePredicateFactory('age', 10, 20);

  it('should be a function', function(){
    expect(typeof predicate).toEqual('function');
  });

  it('should return true if the objects attribute is within range', function(){
    var inRangeEvent = new App.Event({'age': 15});
    expect(predicate(inRangeEvent)).toBeTruthy();
  });

  it('should return false if the objects attribute is out of range', function(){
    var outOfRangeEvent = new App.Event({'age': 25});
    expect(predicate(outOfRangeEvent)).toBeFalsy();
  });

});