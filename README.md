# observable-js

A small *mixin* to make your *objects' constructors* **observable**.

-------------------------------

## Install

```bash
npm install observable-js
```

-------------------------------

## Usage

Just *extend* the *mixin* with your favourite method:

```javascript
var Observable = require('observable-js');

var MyObservable = extendWithYourFavouriteMethod(function() {
	setTimeout(function(that) {
		that._notifyObservers('an-event', {foo: 'bar'});
	}, 2000, this);
}, Observable);

var anObservable = new MyObservable();
anObservable.subscribe('an-event', function(optionalData) {
	console.log('an-event happened', optionalData);
});

```

-------------------------------

##Methods

- `.subscribe(String event, Function callback)`
- `.unsubscribe(String event, Function callback)`
- `._notifyObservers(String event, [data1, [data2], ...])`

> _Note:_ the *wildcard* (`*`) *event* will be *triggered* on any *event*.

-------------------------------

## Run tests:
```bash
npm test
```