module.exports = (function(require) {
	'use strict';

	var Observer = function(event, callback) {
		this
			.setEvent(event)
			.setCallback(callback);
	};
	Observer.prototype.setEvent = function(event) {
		if(typeof event != 'string') {
			throw new TypeError('Event must be an string');
		}
		event = event.trim();
		if(!event) {
			throw new RangeError('Event can not be empty');
		}
		this._event = event;
		return this;
	};
	Observer.prototype.setCallback = function(callback) {
		if(typeof callback != 'function') {
			throw new TypeError('Callback must be a function');
		}
		this._callback = callback;
		return this;
	};
	Observer.prototype.getEvent = function() {
		return this._event;
	};
	Observer.prototype.getCallback = function() {
		return this._callback;
	};
	Observer.prototype.isListeningForEvent = function(event) {
		if(typeof event != 'string') {
			throw new TypeError('Event must be an string');
		}
		return this.getEvent() == '*' || this.getEvent() == event.trim();
	};
	Observer.prototype.callWithArguments = function(argumentsArr) {
		this.getCallback().apply(null, argumentsArr);
		return this;
	};
	Observer.prototype.is = function(event, callback) {
		return this._event == event && this._callback == callback;
	};

	return Observer;
})(require);