#msngr.js API
This document outlines the exposed msngr.js API. It does not cover anything internal that isn't expected to be used by typical developers.

## ```msngr(topic, category, dataType)```
The main msngr method takes in 3 strings to generate a message object from which all other actions are derived.

```topic (required)``` - a string to signify the topic of the message.

```category (optional)``` - a string to signify the category of the message.

```dataType (optional)``` - a string to signify the dataType of the message.

```returns``` a msngr object

```javascript
var msg = msngr("MyTopic", "MyCategory", "MyDataType");
```

## ```msngr object```
The methods below are part of a ```msngr``` object returned from the ```msngr()``` method.

### ```.emit(payload, callback)```
Sends a payload to all registered handlers to the specified message. The optional callback is executed when all handlers are finished executing.

```payload (optional)``` - the payload to send to a receiver.

```callback (optional)``` - the callback to execute when all handlers finish executing. Provides a result object as a first parameter to the callback with an aggregation of all synchronously or asynchronously returned data. The ```payload``` parameter can be omitted while just a ```callback``` is passed into ```.emit()```.

```javascript
var msg = msngr("MyTopic");
msg.emit(function (result) {
    console.log(result);
});
```

### ```.persist(payload)```
Registers a payload to be sent to all matching handlers regardless of when they are registered (now or in the future).

```payload (optional)``` - the payload to send to a receiver.

```javascript
var msg = msngr("MyTopic");
msg.persist("My data");
```

### ```.on(callback)```
Registers a handler to handle all emissions of the specified message. The callback can take a result either synchronously or asynchronously to supply back to an emit callback.

```callback (required)``` - registers a method to handle the previously supplied message. The value returned is then sent to the emit callback. If a return value needs to be asynchronous then the second parameter supplied to the callback can be used.

```javascript
var msg = msngr("MyTopic");
msg.on(function (payload, async) {
    var done = async();
    done("Somevalue");
});
msg.emit(function (result) {
    console.log(result); // Prints ["Somevalue"]
});
```

### ```.once(callback)```
The same as the ```.on(callback)``` except the handler is automatically unregistered after one execution.

```callback (required)``` - registers a method to handle the previously supplied message. The value returned is then sent to the emit callback. If a return value needs to be asynchronous then the second parameter supplied to the callback can be used.

```javascript
var msg = msngr("MyTopic");
msg.once(function (payload, async) {
    var done = async();
    done("Somevalue");
});
msg.emit(function (result) {
    console.log(result); // Prints ["Somevalue"]
});
```

### ```.option(key, value)```
Options are extensions added into msngr and are executed on payloads before being sent to any registered handlers. Options are comprised of a key to enable a specific option and a value consisting of any necessary configuration needed to execute the option.

```key (required)``` - a registered option key (e.g. "dom" is bundled into msngr).

```value (required)``` - any configuration options that are needed for a specific option.

```javascript
var msg = msngr("MyTopic");
msg.option("dom", ["input[name=Name]"]);
msg.bind("button", "click");
msg.on(function (payload) {
    console.log(payload.Name); // returns the gathered input's value
});
```

### ```.bind(element, event)```
Binds an HTML element and event to the specified message. Payload consists of aggregated input values when the 'dom' option is specified with an array of selectors.

```element (required)``` - an HTML node or selector.

```event (required)``` - an event to bind a message to.

```javascript
var msg = msngr("MyTopic");
msg.option("dom", ["input[name=Name]"]);
msg.bind("button", "click");
msg.on(function (payload) {
    console.log(payload.Name); // returns the gathered input's value
});
```

### ```.cease()```
Ceases all payloads being persisted based on the specified message.

### ```.drop(handler)```
Drops a specific handler that was registered via ```.on()```.

```handler (required)``` - the handler to drop.

### ```.unbind(element, event)```
Unbinds the specified message from an element's event.

```element (required)``` - an HTML node or selector.

```event (required)``` - an event to unbind the message.

### ```.dropAll()```
Drops all handlers registered via ```.on()```.

## ```misc utilities```
There are multiple utility methods included in msngr. Some are used internally and some are exposed for external use by others.

### ```msngr.exist(obj)```
Returns false if obj is undefined or null otherwise true.

```javascript
console.log(msngr.exist(undefined)); // Outputs false
```

### ```msngr.exists(...)```
Accepts n number of arguments. Returns false if all arguments are undefined or null otherwise true.

```javascript
console.log(msngr.exists({ }, [], "whatever")); // Outputs true
```

### ```msngr.isString(obj)```
Returns true if obj is a string otherwise false.

```javascript
console.log(msngr.isString("something")); // Outputs true
```

### ```msngr.areStrings(...)```
Accepts n number of arguments. Returns true if all arguments are a string otherwise false.

```javascript
console.log(msngr.areStrings("something", "another", "")); // Outputs true
```

### ```msngr.isArguments(obj)```
Returns true if obj is an arguments object otherwise false.

### ```msngr.areArguments(...)```
Accepts n number of arguments. Returns true if all arguments are an arguments object otherwise false.

### ```msngr.id()```
Returns a random UUID.

### ```msngr.now(noDuplicates)```
Uses feature detection to find the highest time resolution available in its running environment (performance.now(), process.hrtime() or getTime()). Once the best feature is cached the method will always return the time in milliseconds.

```noDuplicates (optional)``` - only useful when the best available time resolution is getTime() (which kinda sucks); this flag, when set to ```true```, will force it to return a unique value even if the resolution isn't good enough to do so (hence the result will be slightly inaccurate but still useful).

### ```msngr.removeFromArray(arr, value)```
Removes a value from an array. Optimized for better performance in larger arrays as it will reorder the item to be removed (thus not preserving order) to increase performance.

```arr (required)``` - the array to remove a value from.

```value (required)``` - the value from remove from the previously specified array.

### ```msngr.argumentsToArray(args)```
Converts an arguments object to an array object.

```args (required)``` - the arguments object to convert to an array.
