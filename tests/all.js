(function() {
	Function.prototype.extendFrom = function(Parent) {
		var thisFn = this,
			thisPrototype = this.prototype,
			superObj = {};

		var ret = function() {
			Parent.apply(this, arguments);
			thisFn.apply(this, arguments);
		};

		Object.keys(thisPrototype).forEach(function(aKey) {
			ret.prototype[aKey] = thisPrototype[aKey];
		});
		Object.keys(Parent.prototype).forEach(function(aKey) {
			ret.prototype[aKey] = Parent.prototype[aKey];
		});

		var _super = {};
		Object.keys(ret.prototype).forEach(function(aKey) {
			if(typeof ret.prototype[aKey] == 'function') {
				_super[aKey] = ret.prototype[aKey];
			}
		});
		ret.prototype._super = function() {
			var that = this,
				ret = {};

			Object.keys(_super).forEach(function(aKey) {
				ret[aKey] = function() {
					return _super[aKey].apply(that, arguments);
				};
			});

			return ret;
		};

		ret.prototype.constructor = ret;

		return ret;
	};
})();

(function(require) {
	'use strict';

	var chai = require('chai'),
		chaiAsPromised = require('chai-as-promised'),
		assert = chai.assert,
		expect = chai.expect,
		should = chai.should(),
		Observable = require('../src/observable');
	chai.use(chaiAsPromised);

	suite('Observable', function() {
		var Obs = function() {
		}.extendFrom(Observable);
		Obs.prototype.doSomething = function() {
			this._notifyObservers('something', 1, 2, 3);
			return this;
		};
		Obs.prototype.doSomethingElse = function() {
			this._notifyObservers('something-else', 'a', 'b', 'c');
			return this;
		};

		test('Subscribe to an event and return itself', function() {
			var obs = new Obs();
			return assert.equal(obs.subscribe('anEvent', function() {}), obs);
		});
		test('Subscribe to an event throws error if event is not an string', function() {
			var obs = new Obs();
			return assert.throw(function() {
				obs.subscribe(8, function() {});
			}, TypeError, 'Event must be an string');
		});
		test('Subscribe to an event throws error if event is empty', function() {
			var obs = new Obs();
			return assert.throw(function() {
				obs.subscribe('   ', function() {});
			}, RangeError, 'Event can not be empty');
		});
		test('Subscribe to an event throws error if callback is not a function', function() {
			var obs = new Obs();
			return assert.throw(function() {
				obs.subscribe('anEvent', 8);
			}, TypeError, 'Callback must be a function');
		});
		test('Observer gets called', function() {
			var obs = new Obs(),
				changed = false;
			return assert.ok(function() {
				obs.subscribe('something', function() {
					changed = true;
				});
				obs.doSomething();
			}, changed);
		});
		test('Observer gets called with the correct arguments', function() {
			var obs = new Obs(),
				args;
			obs.subscribe('something', function() {
				args = [].slice.call(arguments, 0);
			});
			obs.doSomething();
			return assert.deepEqual(args, [1, 2, 3]);
		});
		test('Observable don\'t mix things', function() {
			var obs = new Obs(),
				args;
			obs.subscribe('something-else', function() {
				args = [].slice.call(arguments, 0);
			});
			obs.subscribe('something', function() {
				throw 'This should not be called!';
			});
			obs.doSomethingElse();
			return assert.deepEqual(args, ['a', 'b', 'c']);
		});
		test('Observer calls all the corresponding observers', function() {
			var obs = new Obs(),
				timesCalled = 0;
			obs.subscribe('something', function() {
				timesCalled++;
			});
			obs.subscribe('something', function() {
				timesCalled++;
			});
			obs.subscribe('something', function() {
				timesCalled++;
			});
			obs.doSomething();
			return assert.equal(timesCalled, 3);
		});
		test('Observer always calls the wildcard', function() {
			var obs = new Obs(),
				timesCalled = 0;
			obs.subscribe('*', function() {
				timesCalled++;
			});
			obs.doSomething();
			obs.doSomethingElse();
			return assert.equal(timesCalled, 2);
		});
		test('Observer doesn\'t change "this" when calling callback', function() {
			var obs = new Obs(),
				func = function() {
					that = this;
				},
				that;
			obs.subscribe('something', func.bind({foo: 'bar'}));
			obs.doSomething();
			return assert.deepEqual(that, {foo: 'bar'});
		});
		test('Unsubscribe', function() {
			var obs = new Obs(),
				timesCalled = 0,
				callback = function() {
					timesCalled++;
				};
			obs.subscribe('something', callback);
			obs.doSomething();
			obs.unsubscribe('something', callback);
			obs.doSomething();
			return assert.equal(timesCalled, 1);
		});
		test('_notifyObservers doesn\'t brake when no events attached', function() {
			var obs = new Obs();
			return assert.doesNotThrow(function() {
				obs._notifyObservers('something');
			});
		});
		test('Unsubscribe doesn\'t brake when no events attached', function() {
			var obs = new Obs(),
				callback = function() {};
			return assert.doesNotThrow(function() {
				obs.unsubscribe('something', callback);
			});
		});
	});
})(require);