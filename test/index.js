var observable = require('observable');
var assert = require('assert');
var Model;

describe('Observable', function(){

  it('should set properties in the constructor', function(){
    var model = observable({ 'foo' : 'bar' });
    assert( model.get('foo') === 'bar' );
  })

  it('should set key and value', function(){
    var model = observable();
    model.set('foo', 'bar');
    assert( model.attributes.foo === 'bar' );
  });

  it('should set key and value with an object', function(){
    var model = observable();
    model.set({ 'foo' : 'bar' });
    assert( model.attributes.foo === 'bar' );
  });

  it('should emit change events', function(){
    var match = false;
    var model = observable();
    model.change('foo', function(){
      match = true;
    });
    model.set('foo', 'bar');
    assert(match === true);
  });

  it('should set properties in constructor', function(){
    var obj = observable({ 'foo':'bar' });
    assert( obj.get('foo') === 'bar' );
  });

  it('should set nested properties', function(){
    var model = observable();
    model.set('foo.bar', 'baz');
    assert( model.attributes.foo.bar === 'baz' );
  });

  it('should get nested properties', function(){
    var model = observable();
    model.set('foo', {
      bar: 'baz'
    });
    assert( model.get('foo.bar') === 'baz' );
  });

  it('should return undefined for missing nested properties', function(){
    var model = observable();
    model.set('razz.tazz', 'bar');
    assert( model.get('foo') === undefined );
    assert( model.get('foo.bar') === undefined );
    assert( model.get('razz.tazz.jazz') === undefined );
  })

  it('should emit change events for nested properties', function(){
    var match = 0;
    var model = observable();
    model.set('foo.bar', 'baz');
    model.change('foo.bar', function(val){
      assert(val === 'zab');
    });
    model.change('foo', function(val){
      assert(val.bar === "zab");
    });
    model.change(function(attr, val){
      assert(attr === "foo.bar");
      assert(val === "zab");
    });
    model.set('foo.bar', 'zab');
  })

  it('should be able to do computed properties', function(){
    var model = observable({
      one: 1,
      two: 2
    });
    model.computed('three', ['one', 'two'], function(){
      return this.get('one') + this.get('two');
    });
    assert(model.get('three') === 3);
  })

  it('should emit change events for computed properties', function(done){
    var model = observable({
      one: 1,
      two: 2
    });
    model.computed('three', ['one', 'two'], function(){
      return this.get('one') + this.get('two');
    });
    model.change('three', function(value){
      assert(value === 4);
      done();
    });
    model.set('one', 2);
  })

  it('should use the change method for binding to changes', function(done){
    var model = observable();
    model.change('one', function(value, previous){
      assert(value === 1);
      done();
    });
    model.set('one', 1);
  })

  if('should bind to all changes using the method', function(done){
    var model = observable();
    model.watch(function(attr, value){
      assert(attr === 'one');
      assert(value === 1);
      done();
    });
    model.set('one', 1);
  });

  it('should return a method to unbind changes', function(){
    var called = 0;
    var model = observable();
    var unbind = model.change('one', function(value){
      called += 1;
    });
    unbind();
    model.set('one', 1);
    assert(called === 0);
  })

  it('should bind to changes of multiple properties', function(){
    var called = 0;
    var model = observable();
    model.change(['one', 'two'], function(attr, value){
      called += 1;
    });
    model.set('one', 1);
    assert(called === 1);
  })

  it('should unbind to changes of multiple properties', function(){
    var called = 0;
    var model = observable();
    var unbind = model.change(['one', 'two'], function(attr, value){
      called += 1;
    });
    unbind();
    model.set('one', 1);
    model.set('two', 1);
    assert(called === 0);
  })

});