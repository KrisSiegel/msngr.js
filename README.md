<img src="https://github.com/KrisSiegel/msngr.js/raw/master/resources/logo.png" alt="msngr.js logo" title="msngr.js logo" />

Messaging is a powerful development pattern that makes decoupling components and providing internal APIs incredibly easy. The primary goal of msngr is to provide a high quality, asynchronous method of consuming and emitting messages that work in both node and the web browser.

There is a secondary goal in providing great, universal objects and functions that are useful in essentially every application. This includes type validation using ```msngr.is(obj)```, basic http requests with ```msngr.net(url)``` that work identically across platforms and a merge cache that includes transactions in ```msngr.mache()```. There are also utilities such as ```msngr.immediate(fn)``` that provide a faster-than-setTimeout way of creating your own asynchronous methods.

### Snag a copy of msngr
Install via npm or bower by running ```npm install msngr``` or ```bower install msngr```

Grab a copy of the ```msngr.js``` or ```msngr.min.js``` files directly from this repo

Reference msngr directly [from cdnjs](https://cdnjs.com/libraries/msngr)

### Hello, World!
```javascript
// I can call a function when I receive a specific message!
msngr("Output").on(function (words) {
    console.log(words); // Outputs 'Hello, World!', 'I'm chainable!' and 'Weee'
});

// I can emit messages of any type. I can even chain almost anything.
msngr("Output")
  .emit("Hello, World!")
  .emit("I'm chainable!")
  .emit("Weee");

// I can emit and persist a message, too so future handlers can receive it
msngr("Important", "Message").persist("I am persisted!");

// See?
msngr("Important", "Message").on(function (text) {
	console.log(text); // Outputs 'I am persisted!'
});

// I can even guarantee a handler is called once
msngr("Once").once(function (str) {
	console.log(str); // Only outputs 'Just once'
});

msngr("Once").emit("Just once").emit("asdljadlka").emit("sadjkhada");
```

### Anatomy of a message
Messages can be comprised of a topic, category and subcategory with topic being the only required piece all of which are specified in the main msngr function ```msngr(topic, category, subcategory)```. This allows for a large range of message consumption from the very general to the highly specific.

### Consuming and emitting
When consuming or emitting a message you can choose to match just the topic, the topic and category or the topic, category and subcategory. This allows for a great amount of specificity when choosing what your handler can take care of (is it generic in that it can handle anything? should it only handle specific categories? subcategories?). Take a look at this example:

```javascript
// Handler that receives all profile save attempts
msngr("Profile", "Save").on(function (payload) {
    console.log(payload);
});

// Handler that only received profile saves in json
msngr("Profile", "Save", "application/json").on(function (payload) {
    console.log("Save the json payload");
});

// Handler that only received profile saves in xml
msngr("Profile", "Save", "application/xml").on(function (payload) {
    console.log("Save the xml payload");
});

msngr("Profile", "Save", "application/json").emit({ name: "myname!" });
msngr("Profile", "Save", "application/xml").emit("<xml><name>myname!</name></xml>");
```

The example above demonstrates that the handler will only fire when the specified criteria of a registered ```on``` handler is satisfied.

### Middleware
A mechanism for middleware exists that creates a global or localized affect. This allows for payload transformation to occur prior to any messages and their payloads being delivered to handlers. A middleware needs to be registered via ```msngr.middleware(key, fn, force)``` where the ```key``` is the name of the middleware, the ```fn``` is the middleware itself and ```force``` is a boolean that specifies whether the middleware should execute on *all* messages or not (if ```false``` then ```msngr().use(key)``` needs to be called on a message to have it applied).

```javascript
msngr.middleware("uppercase", function (payload, message) {
    if (msngr.is(payload).string) {
        return payload.toUpperCase();
    }
    return payload;
}, true);

msngr("SayIt").on(function (payload) {
    console.log(payload); // Prints 'HELLO, WORLD!'
});

msngr("SayIt").emit("hello, world!");
```

### Persist, once and drop
Messages can also have a payload that is persistent. This is incredibly handy when doing initialization. You can specify a message when something is initialized and persist the message (even with an empty payload) so that handlers registered before or after said initialization are still called. This is done through ```msngr().persist()``` and can be ended through ```msngr().cease()```.

There is also a ```msngr().once()``` that works just like ```msngr().on()``` except it is guaranteed to execute only once. In a similar vein you can drop ```msngr().on()``` registered handles either one at a time through ```msngr().drop(fn)``` or all at once for a specific message via ```msngr().dropAll()```.

### msngr.is()
Validation is a very important part of dealing with a dynamic language such as JavaScript. The ```msngr.is(obj)``` function is an attempt to make it as intuitive and straight-forward as possible. Simply call ```msngr.is(obj)``` providing whatever you want to check as the parameter (you can also pass in multiple parameters to check them all in an AND fashion) then call one of the following properties on the returned object:

```javascript
msngr.is(obj).arguments; // checks for arguments object
msngr.is(obj).boolean; // checks for boolean
msngr.is(obj).string; // check for string
msngr.is(obj).date; // checks for date
msngr.is(obj).array; // checks for array
msngr.is(obj).number; // checks for number
msngr.is(obj).object; // checks for object
msngr.is(obj).function; // checks for function
msngr.is(obj).symbol; // checks for symbol

msngr.is(obj).there; // checks to see if the obj exists
msngr.is(obj).empty; // checks to see if an object, array or string is empty (including null and undefined)

msngr.is(obj).htmlElement; // checks to see if it's an HTML Element
msngr.is(obj).nodeList; // checks to see if it's an HTML NodeList
```

### msngr.net()
There is basic http request functionality that allows the sending of the typical HTTP verbs (GET, POST, PUT, DELETE and OPTIONS) to a server. This is not meant to be comprehensive but provides an 90% solution which works, without a code change, in both node and the web browser. It also works as a handy URL parser! ```msngr.net(protocol, host, port)``` looks nice and neat but you can straight up send it a URL and it will parse and separate it into the ```protocol```, ```host``` and ```port```, all available as properties on the returned net object.

```javascript
var net = msngr.net("https://mywebsite.com");
console.log(net.protocol); // prints 'https'

net.get({
    path: "/endpoint",
    query: {
        q: "my query"
    }, function (err, result) {
        console.log(result);
    }
});
```

In the simple ```msngr().net()``` example above the query object is translated into proper query strings and sent to the "/endpoint". Simple, right? You can also provide a ```header``` object that will get sent as proper HTTP headers and a ```payload``` object that can contain whatever you're sending to the server.

### Mache Mache Mache!
What the hell is a 'mache'? It's a merge cache. Get it? Merge cache...mache...okay okay. So how does it work? It's a lot like a typical local cache in that it works via key value pairs but it includes some neat additions including each setting of a value is merged with the previous value if it exists, the ability to revert multiple sets and even transactions.

```javascript
var mache = msngr.mache();

mache.set("mykey", {
    test: "mytest"
});

mache.set("mykey", {
    test: "anothertest"
});

mache.get("mykey"); // returns { test: "anothertest" }

mache.revert("mykey");

mache.get("mykey"); // returns { test: "mytest" }
```

Mache transactions work similar to SQL transactions; when you want to start simply call ```.begin()``` on your mache instance, then get and set whatever you want. Once you're finished either call ```.rollback()``` to end the transaction and eliminate all changes done during that time or ```.commit()``` to commit all of the changes made. You can even create a mache instance with some configuration options to change the level of revisions to store outside of transactions along with emitting all changes through messages so as data changes your components can react to said changes.

```javascript
var mache = msngr.mache({
    revisions: 10, // default is 3
    emitChanges: true // emits on the msngr("msngr.mache", "change") message
});
```

### msngr.immediate()
So if you want to create an asynchronous process many developers turn to ```setTimeout(fn, 0);``` but that's actually rather slow to execute in web browsers (typically values less than 10 or so are ignored and even 0 isn't guaranteed to execute immediately). Using ```setImmediate(fn)``` is a far better choice but it's almost exclusively available in node and IE. This is where ```msngr.immediate(fn)``` comes in. There is a way to simulate ```setImmediate(fn)``` when it doesn't exist in a web browser so ```msngr.immediate(fn)``` will use whatever the fastest solution that exists on the platform it is running on to execute something asynchronously.

```javascript
msngr.immediate(function () {
    console.log("Hey there!");
});

```

### msngr.parallel(methods, callback) / msngr.series(methods, callback)
Handling asynchronous behaviors can be difficult and there are many libraries (async.js) and techniques (promises, async & await) for handling such issues. But sometimes you just need a simple way to take multiple methods and combine them. Msngr uses this capability internally for handling message delegation and processing of middleware so these two methods are the public version of the very same API.

```javascript
var props = { };
msngr.parallel([
    function () { props.value1 = 42; },
    function () { props.value2 = "forty two"; },
    function () { props.value3 = true; },
], function () {
    console.log(props.value1); // Prints 42
    console.log(props.value2); // Prints 'forty two'
    console.log(props.value3); // Prints true
});

msngr.series([
    function () { return "s" },
    function () { return "e" },
    function (async) { async()("r") },
    function (async) { async()("i") },
    function (async) { async()("e") },
    function () { return "s" }
], function (results) {
    console.log(results.join("")); // Prints "series"
});
```

#### Contact
For questions, news, and whatever else that doesn't fit in GitHub issues you can follow me [@KrisSiegel](https://twitter.com/KrisSiegel)

Copyright © 2014-2017 Kris Siegel
