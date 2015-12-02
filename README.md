# msngr.js
Msngr provides an asynchronous message bus capable of providing three degrees of delineation for each message. Emitted messages are handled by N number of handlers with their results, delivered synchronously or asynchronously, aggregated and returned to the original emitter. Msngr also provides some awesome utilities such as making HTTP / HTTPS requests that works in both node *and* the web browser, configuration management, parallel processing of N number of functions through the executer and other misc utilities to provide validation and DOM helpers.

Msngr also provides options that allow easy extensibility with two built in. First, the cross-window option, allows messages to be delivered and received across N number of web browser tabs as long as the domain is the same. The second is the dom option which allows tying messages directly to DOM events while also gathering and aggregating values from inputs within that same message payload.

If you want to jump in immediately msngr is hosted via [cdnjs](https://cdnjs.com/) and is ready to go in [this jsfiddle](http://jsfiddle.net/w2t0g1vc/) just for you! Alternatively you can install msngr via ```npm install msngr```, ```bower install msngr``` or by downloading ```msngr.js``` or ```msngr.min.js``` directly from this repository.

## Okay let's see how awesome msngr is in action
First, let's look at a very basic usage of msngr where we setup a receiver then emit a payload to it. [Execute on jsfiddle](http://jsfiddle.net/w2t0g1vc/2/)
```html
<div id="output"></div>
```
```javascript
msngr("MyTopic").on(function(payload) {
    var output = document.getElementById("output");
    output.appendChild(document.createTextNode("I received the following payload:"));
    output.appendChild(document.createElement("br"));
    output.appendChild(document.createTextNode(payload));
});

msngr("MyTopic").emit("This is crazy cool!");
```

Okay that's cool and all but I want to return data from my handler to my emit; how!?[Execute on jsfiddle](http://jsfiddle.net/w2t0g1vc/4/)
```html
<div id="output"></div>
```
```javascript
msngr("Random").on(function(payload) {
    return Math.floor(Math.random() * 100);
});

msngr("Random").on(function(payload, message, async) {
    var done = async();
    done(Math.floor(Math.random() * 100));
});

msngr("Random").emit(function(result) {
    var output = document.getElementById("output");
    output.appendChild(document.createTextNode(result));
});
```

Okay so now you see how to create multiple handlers on the same message and how emit aggregates both the synchronous and asynchronous results from it. But where's the three degrees of delineation? Where's the binding of messages directly to DOM events? Well, glad you asked! [Execute on jsfiddle](http://jsfiddle.net/w2t0g1vc/5/)
```html
<form>
    <label for="firstName">First name</label>
    <input type="text" name="firstName" value="Jane" />
    <br />
    <label for="lastName">Last name</label>
    <input type="text" name="lastName" value="Smith" />
    <br />
    <input type="button" value="Save" />
</form>
<div id="output"></div>
```
```javascript
var output = document.getElementById("output");
msngr("User", "Profile", "Save")
	.bind("input[type=button]", "click")
    .option("dom", ["input[type=text]"])
	.on(function(payload, message) {
    	output.appendChild(document.createTextNode("First name: " + payload.firstName));
    	output.appendChild(document.createElement("br"));
        output.appendChild(document.createTextNode("Last name: " + payload.lastName));
	});
```
As you can see ```.bind()``` allows us to bind any message directly to a DOM element's event but even cooler is the call to ```.option("dom", [])``` as it allows you to pass in an array of selectors which msngr will then gather and aggregate the values for you in a nice, neat object using appropriate keys based on an element's name, id and / or the tag name plus appending numbers as necessary.

## Okay that's cool but where are these 'utilities' mentioned above?
Well let's dive right into how some of the utilities work!

### msngr.net()
This demonstrates how to conduct a basic HTTP request (due to CORS restrictions and msngr.net being limited to sending JSON or plain text payloads we can't use jsfiddle here). Msngr's net will handle sending and receiving text and json in both node and a web browser.

```html
<div id="output"></div>
```
```javascript
var output = document.getElementById("output");
msngr.net("http://localhost:3000")
	.post({
    	path: "/endpoint",
    	payload: {
            testing: "mytest"
        }
	}, function(err, result) {
    	output.appendChild(document.createTextNode(JSON.stringify(result)));
	});
```

### msngr.config()
How about some configuration sexiness? [Execute on jsfiddle](http://jsfiddle.net/w2t0g1vc/6/)

```html
<div id="output"></div>
```
```javascript
var output = document.getElementById("output");
msngr.config("my.server.org", {
    host: "localhost",
    port: 3000,
    debug: true
});

output.appendChild(document.createTextNode(JSON.stringify(msngr.config("my.server.org"))));

msngr.config("my.server.org", {
    host: "productionsystem.org"
});

output.appendChild(document.createTextNode(JSON.stringify(msngr.config("my.server.org"))));
```

As you can see msngr's configuration management allows the merging and overwriting of configurations as you go along. This is great for setting a default set of configurations that can later be overwritten due to being in another environment, testing, etc.

## Would you like to know more?
While msngr.js isn't very large the full documentation has been split up for easy reading.

[Full API](https://github.com/KrisSiegel/msngr.js/blob/master/docs/api.md) - This is the full, exposed API that msngr makes available. This includes the methods that can be used and examples for each.

[Web browser niceties](https://github.com/KrisSiegel/msngr.js/blob/master/docs/web%20browser%20niceties.md) - This covers binding msngr.js to elements and events, unbinding them, how to gather up values from various types of elements and cross-window communication.

[Extending and hacking](https://github.com/KrisSiegel/msngr.js/blob/master/docs/extending%20and%20hacking.md) - Want to extend the capabilities of msngr.js? It's actually quite easy and this document covers it. Using msngr.js deep in a production system then suddenly find *something* that you need to change to avoid catastrophe? Hacking msngr.js is also covered for those times when you need *unorthodox* solutions :)

[Contributing](https://github.com/KrisSiegel/msngr.js/blob/master/docs/contributing.md) - Want to contributed to msngr.js? There are a couple of things you should know before you submit that pull request to better ensure it gets accepted :)

## Getting in contact
For questions, news, and whatever else that doesn't fit in GitHub issues you can follow me [@KrisSiegel](https://twitter.com/KrisSiegel)

Copyright © 2014-2015 Kris Siegel
