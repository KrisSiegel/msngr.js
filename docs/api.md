# msngr.js API
This document outlines the exposed msngr.js API. It does not cover anything internal that isn't expected to be used by typical developers and as such all internal APIs are not bound by semantic versioning conventions (aka even minor point updates may break your code if you rely on internal, private API calls).

## ```msngr(topic, category, subcategory)```
The main msngr method takes in 3 strings to generate a message object from which all other actions are derived.

```topic (required)``` - a string to signify the topic of the message.

```category (optional)``` - a string to signify the category of the message.

```subcategory (optional)``` - a string to signify the subcategory of the message.

```returns``` a msngr object

```javascript
var msg = msngr("MyTopic", "MyCategory", "MySubCategory");
```

## msngr object
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

```callback (required)``` - registers a method to handle the previously supplied message. The value returned is then sent to the emit callback. If a return value needs to be asynchronous then the third parameter supplied to the callback can be used.

```javascript
var msg = msngr("MyTopic");
msg.on(function (payload, message, async) {
    var done = async();
    done("Somevalue");
});
msg.emit(function (result) {
    console.log(result); // Prints ["Somevalue"]
});
```

### ```.once(callback)```
The same as the ```.on(callback)``` except the handler is automatically unregistered after one execution.

```callback (required)``` - registers a method to handle the previously supplied message. The value returned is then sent to the emit callback. If a return value needs to be asynchronous then the third parameter supplied to the callback can be used.

```javascript
var msg = msngr("MyTopic");
msg.once(function (payload, message, async) {
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

```javascript
var msg = msngr("MyTopic");
msg.persist("Cookies!!!");
msg.cease(); // Gets rid of "Cookies!!!" :(
```

### ```.drop(handler)```
Drops a specific handler that was registered via ```.on()```.

```handler (required)``` - the handler to drop.

```javascript
var msg = msngr("MyTopic");
var myHandler = function (payload) {
    console.log(payload);
};
msg.on(myHandler);
msg.drop(myHandler);
```

### ```.unbind(element, event)```
Unbinds the specified message from an element's event.

```element (required)``` - an HTML node or selector.

```event (required)``` - an event to unbind the message.

```javascript
var msg = msngr("MyTopic");
msg.bind("input[name=password]", "change");
msg.unbind("input[name=password]", "change");
```

### ```.dropAll()```
Drops all handlers registered via ```.on()```.

```javascript
var msg = msngr("MyTopic");
msg.dropAll(); // Drops all handlers even outside of 'MyTopic'!!!
```

## ```msngr.mache(options)```
Provides a merge cache with the ability to revert changes and modify data within a transaction. The ```msngr.mache()``` method itself always returns a new instance of a merge cache.

```options (optional)``` - Currently has two options that can be specified as part of a JavaScript object. ```revisions``` can be specified if you want to change the amount of revisions stored for each object (default is 3). You can specify any positive number. There is also ```emitChanges``` which is a boolean value that defaults to false. When set to true you can listen to the topic of ```msngr.mache``` with a category of ```change``` with the optional subcategory of whatever id you used in mache. This will return a payload with the ```id```, ```oldValue``` and ```newValue``` tuple.

## msngr mache object
The mache object provides an interface to store, update and remove data along with some handy ways to revert changes and use transactions.

### ```.get(id)```
Gets an item back based on the supplied id.

### ```.getDeep(id, property, defaultValue)```
Takes an item with a specific ID and transverses the properties to the designated one. If it doesn't exist it will return the specified defaultValue or undefined.

### ```.set(id, value)```
Sets a value at a specified ID.

### ```.remove(id)```
Removes an item at the specified ID.

### ```.revert(id)```
Reverts an item at the specified ID to the previous value it held. This can be called multiple times until you hit the revision limit.

### ```.begin()```
Starts a transaction. Anything done to the mache object from this point on is batch-commit-able or batch-revert-able.

### ```.rollback()```
Ends a transaction by undoing all actions done to the mache instance since calling ```.begin()```.

### ```.commit()```
Ends a transaction by committing all actions done to the mache instance since calling ```.begin()```.

## ```msngr.net(protocol, host, port)```
Provides a way to conduct consistent network communications in both the web browser and node.js. The result of this method is a msngr net object.

```protocol (required)``` - Specifies the protocol to use (currently HTTP or HTTPS). Alternatively the entire URI can be passed in.

```host (optional)``` - Specified the host name. It's marked as optional as protocol, host and port can be specified as a single item in the first parameter.

```port (optional)``` - Specified the port. It's marked as optional as protocol, host and port can be specified as a single item in the first parameter.

## msngr net object
The net object provides handy shortcuts for conducting your network activities. Note that this is mostly useful for plaintext or JSON transport (or other non-binary related types). This DOES NOT handle multipart forms / files and likely never will as it's meant to be a basic, consistent mode of communication.

### ```.get(options, callback)```
### ```.post(options, callback)```
### ```.put(options, callback)```
### ```.delete(options, callback)```
### ```.options(options, callback)```
Conducts an HTTP / HTTPS for the specified verb operation.

``` options (required)``` - Expects an object that contains the following, optional properties (all defaults are specified in this definition below and therefore can be elided if desired):
```javascript
{
    path: "/", // The path to send the request to
    autoJson: true, // Whether or not it should attempt to JSON.parse() a response IF the content type is 'application/json'
    query: { }, // A set of properties used to generate a query string
    queryString: undefined, // The query object is used to generate this property; only explicitly use this to provide your own querystring,
    headers: { }, // A set of keys and values sent as headers to the specified HTTP service
    payload: undefined // The payload to deliver in the request body
}
```

``` callback (required)``` - The callback to execute when a request has returned a response or has failed. It follows the typical node.js pattern of passing back two parameters: first an error parameter, which should be null when successful, and second a result parameter that should contain the result of the request.

```javascript
var net = msngr.net("http://localhost:3001");
net.post({
    path: "/users",
    payload: {
        username: "kris",
        email: "redacted@redacted.com"
    }
}, function(err, result) {
    if (err) {
        console.log("Oh noes it failed!");
    }
    console.log(result);
});
```

### ```.protocol```
This property returns the protocol of the current net object (either parsed from a single input or explicitly provided in the parameters).

### ```.host```
This property returns the host of the current net object (either parsed from a single input or explicitly provided in the parameters).

### ```.port```
This property returns the port of the current net object (either parsed from a single input or explicitly provided in the parameters).

## Handy DOM utilities
In implementing the binding and dom option features of msngr some handy DOM utilities had to be created. Why not expose them?

### ```isHtmlElement(obj)```
Determines whether a passed in object is a node within the DOM or something else.

```obj (required)``` - the object to test.

```javascript
console.log(msngr.isHtmlElement(5)); // Outputs false
console.log(msngr.isHtmlElement(document.createElement("div"))); // Outputs true
```

### ```isNodeList(obj)```
Determines whether a passed in object is a NodeList within the DOM or something else.

```obj (required)``` - the object to test.

```javascript
console.log(msngr.isNodeList("chickens")); // Outputs false
console.log(msngr.isNodeList(document.querySelectorAll("div"))); // Outputs true
```

### ```findElement(selector, root)```
Finds a single element via selector.

```selector (required)``` - a standard DOM selector to find an element.

```root (optional)``` - a root position to begin querying. Defaults to document. Handy when dealing with ShadowDom.

```javascript
var elm = msngr.findElement("div");
```

### ```findElements(selector, root)```
Finds multiple elements via selector.

```selector (required)``` - a standard DOM selector to find an element.

```root (optional)``` - a root position to begin querying. Defaults to document. Handy when dealing with ShadowDom.

```javascript
var elms = msngr.findElements("div");
```

### ```getDomPath(element)```
Takes an element and determines the path to accessing it via the DOM and generates an appropriate selector. This is useful when binding against elements that have no unique characteristics.

```element (required)``` - the element to generate a path for.

```javascript
var elm = msngr.findElement("div");
var path = msngr.getDomPath(elm);
var found = msngr.findElement(path); // Same object as elm
```

### ```querySelectorWithEq(selector, root)```
The native querySelector does not support the :eq(n) notation that jQuery has popularized therefore it was implemented here :).

```selector (required)``` - a standard DOM selector to find an element.

```root (optional)``` - a root position to begin querying. Defaults to document. Handy when dealing with ShadowDom.

```javascript
var elm = msngr.querySelectorWithEq("div:eq(1)");
```

### ```querySelectorAllWithEq(selector, root)```
The native querySelectorAll does not support the :eq(n) notation that jQuery has popularized therefore it was implemented here :).

```selector (required)``` - a standard DOM selector to find an element.

```root (optional)``` - a root position to begin querying. Defaults to document. Handy when dealing with ShadowDom.

```javascript
var elms = msngr.querySelectorAllWithEq("div:eq(1) > input");
```

## Miscellaneous utilities
There are multiple utility methods included in msngr most of which start out as internal only and eventually make their way to external exposure depending on whether Kris finds them useful or not :)

### ```msngr.immediate(fn)```
Executes a function, asynchronously, as quickly as possible. In node.js and IE this will use ```setImmediate()```, in Chrome / Firefox / Safari / Opera it will use ```window.postMessage()``` and all other environments that do not support the former will use ```setTimeout(fn, 0);```. This method is handy as ```setImmediate()``` and the ```window.postMessage()``` hack are the fastest ways to execute a method asynchronously. ```setTimeout(fn, 0)``` is hella slow.

```fn (required)``` - the function to execute asynchronously.

### Executer object
The executor object is a very simple way of specifying n number of functions that can then be executed in parallel (similar to async.parallel).

```javascript
var funcs1 = [
    function() {
        return 1 + 1;
    }
];
var executerObj1 = msngr.executer(funcs1);

// Alternatively
var funcs2 = [
    {
        method: function() {
            return 1 + 1;
        },
        params: [1, 2, 3, 4]
    }
];
var executerObj2 = msngr.executer(funcs2);
```

```paramater 1 (required)``` - The parameter should be an array of either functions or of objects in the following format:
```javascript
{
    method: function() {},
    params: [],
    context: this
}
```

#### ```executorObj.parallel(done)```
Executes all methods specified and uses an async callback to provide the sync or async result from each method executed. The callback is only called once each method executes its own callback signifying that code execution has been completed.

```done (optional)``` - The callback method that receives the results from the methods executed.

Example:
```javascript
var funcs = [];
funcs.push(function (async) {
    var done = async();
    done(42);
});
funcs.push(function (async) {
    return 15;
});
var exec = msngr.executer(funcs);
exec.parallel(function (results) {
    console.log(results); // Prints [42, 15]
});
```

### ```msngr.extend(obj, target)```
Extends either the msngr object or a specified target object.

```obj (required)``` - The object used to extend a target. If it's a method it is executed and passed in the external and interface interfaces of msngr.

```target (optional)``` - The target of the extend. If not specified it is assumed you are extending the msngr object.

```javascript
msngr.extend({
    sayHello: function () {
        return "Hello!";
    }
});

console.log(msngr.sayHello());
```

### ```msngr.merge(input1, input2, ..., inputN)```
Merges an n number of inputs together. Combines objects with other objects (the merging overwrites in order should conflict arrise), functions with objects, strings and strings and arrays. **NOTE** this will merge references together; it does not produce deep copies for objects.

```inputn (required)``` - Specify as many parameters as necessary for merging.

```javascript
var merged = msngr.merge({ val1: "test" }, { val2: "whatever!" }, { val2: "no!" });
console.log(merged.val1); // Prints "test"
console.log(merged.val2); // Prints "no!"
```

### ```msngr.copy(object)```
Performs a deep copy on the supplied object. Any non-native JavaScript object is simply returned as a reference (coping those, accurately, without knowledge of the object is difficult to get right and is rarely something you'd want copied anyway).

### ```msngr.config()```
The ```msngr.config()``` global cache is now powered by a mache() instance. Please see the msngr.mache() documentation for usage.

msngr.config("yotest", {
    okay: 47
});

console.log(msngr.config("yotest")); // outputs { something: true, another: { what: "yes" }, okay: 47 };
```

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
Accepts n number of arguments. Returns true if all arguments are strings otherwise false.

```javascript
console.log(msngr.areStrings("something", "another", "")); // Outputs true
```

### ```msngr.isObject(obj)```
Returns true if obj is an object otherwise false.

```javascript
console.log(msngr.isObject({ })); // Outputs true
```

### ```msngr.areObjects(...)```
Accepts n number of arguments. Returns true if all arguments are objects otherwise false.

```javascript
console.log(msngr.areObjects({ }, { })); // Outputs true
```

### ```msngr.isNumber(obj)```
Returns true if obj is a number otherwise false.

```javascript
console.log(msngr.isNumber(5)); // Outputs true
```

### ```msngr.areNumbers(...)```
Accepts n number of arguments. Returns true if all arguments are numbers otherwise false.

```javascript
console.log(msngr.areNumbers(1, 5, 7, 9, 42)); // Outputs true
```

### ```msngr.isArray(obj)```
Returns true if obj is an array otherwise false.

```javascript
console.log(msngr.isArray([5, 10, 15])); // Outputs true
```

### ```msngr.areArrays(...)```
Accepts n number of arguments. Returns true if all arguments are arrays otherwise false.

```javascript
console.log(msngr.areArrays([1, 2], [5], [19, 37, 42])); // Outputs true
```

### ```msngr.isFunction(obj)```
Returns true if obj is a function otherwise false.

```javascript
console.log(msngr.isFunction(function () { })); // Outputs true
```

### ```msngr.areFunctions(...)```
Accepts n number of arguments. Returns true if all arguments are functions otherwise false.

```javascript
console.log(msngr.areFunctions(function () { }, function () { })); // Outputs true
```

### ```msngr.isEmptyString(obj)```
Returns true if obj is an empty string otherwise false.

```javascript
console.log(msngr.isEmptyString("")); // Outputs true
```

### ```msngr.areEmptyStrings(...)```
Accepts n number of arguments. Returns true if all arguments are empty strings otherwise false.

```javascript
console.log(msngr.areEmptyStrings("", " ", "  ")); // Outputs true
```

### ```msngr.isArguments(obj)```
Returns true if obj is an arguments object otherwise false.

```javascript
console.log(msngr.isArguments(arguments)); // Outputs true
```

### ```msngr.areArguments(...)```
Accepts n number of arguments. Returns true if all arguments are an arguments object otherwise false.

```javascript
console.log(msngr.areArguments(arguments, [])); // Outputs false
```

### ```msngr.id()```
Returns a random, high performance but unique-enough ID.

```javascript
console.log(msngr.id()); // Outputs ID
```

### ```msngr.uuid()```
Returns a random UUID.

```javascript
console.log(msngr.uuid()); // Outputs UUID
```

### ```msngr.now(noDuplicates)```
Uses feature detection to find the highest time resolution available in its running environment (performance.now(), process.hrtime() or getTime()). Once the best feature is cached the method will always return the time in milliseconds.

```noDuplicates (optional)``` - only useful when the best available time resolution is getTime() (which kinda sucks); this flag, when set to ```true```, will force it to return a unique value even if the resolution isn't good enough to do so (hence the result will be slightly inaccurate but still useful).

```javascript
var start = msngr.now();
// Some computation
var end = msngr.now();
console.log("Started at {0} and ended at {1}.".replace("{0}", start).replace("{1}", end));
```

### ```msngr.removeFromArray(arr, value)```
Removes a value from an array. Optimized for better performance in larger arrays as it will reorder the item to be removed (thus not preserving order) to increase performance.

```arr (required)``` - the array to remove a value from.

```value (required)``` - the value from remove from the previously specified array.

```javascript
var myArray = [5, 17, 42, 97];
console.log(myArray); // Outputs [5, 17, 42, 97]
msngr.removeFromArray(myArray, 42);
console.log(myArray); // Outputs [5, 17, 97]
```

### ```msngr.deDupeArray(arr)```
Removes duplicates from an array and returns the resulting, deduped array.

```arr (required)``` - the array to dedupe.

```javascript
var myArray = [5, 17, 42, 56, 42, 56, 42, 97];
console.log(msngr.deDupeArray(myArray)); // Outputs [5, 17, 42, 56, 97]
```

### ```msngr.isBrowser()```
Returns a boolean indicating whether msngr is running in a browser context or not.

### ```msngr.argumentsToArray(args)```
Converts an arguments object to an array object.

```args (required)``` - the arguments object to convert to an array.

```javascript
var myFunction = function () {
    console.log(msngr.argumentsToArray(arguments));
};

myFunction(15, 27);
```
