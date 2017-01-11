module.exports = (function(require) {
	'use strict';

	var Observer = require('./observer');

	var arrayUtils = {
		remove: function(arr, element) {
			var idx;
			while((idx = arr.indexOf(element)) != -1) {
				arr.splice(idx, 1);
			}
			return arr;
		},
		removeWhen: function(arr, matches) {
			var elementToRemove = arr.find(matches);
			while(elementToRemove) {
				arrayUtils.remove(arr, elementToRemove);
				elementToRemove = arr.find(matches);
			}
			return arr;
		}
	};

	var Observable = function() {
		this._observers = [];
	};
	Observable.prototype.subscribe = function(event, callback) {
		this._observers.push(new Observer(event, callback));
		return this;
	};
	Observable.prototype.unsubscribe = function(event, callback) {
		arrayUtils.removeWhen(this._observers, function(anObserver) {
			return anObserver.is(event, callback);
		});
		return this;
	};
	Observable.prototype._notifyObservers = function(event) {
		var extraArguments = [].slice.call(arguments, 1);

		this._observers.filter(function(anObserver) {
			return anObserver.isListeningForEvent(event);
		}).forEach(function(anObserver) {
			anObserver.callWithArguments(extraArguments);
		});
	};
	
	return Observable;
})(require);