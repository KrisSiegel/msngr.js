#msngr.js

A natural way to write decoupled JavaScript code using messages rather than direct eventing which lends well to developing intercommunication between web components.

###Quick Start
Looking for a TL;DR? This should get you going quickly.

####1. Include msngr.js
#####Browser
```
<script type="text/javascript" src="msngr.min.js"></script>
```
#####node.js
```
var msngr = require("msngr");
```
####2. Register your first receiving method.
```
msngr.receive({ topic: "Alert" }, function () {
	console.log("Received!");
});
```
####3. Send your first message!
```
msngr.send("Alert");
```

###Dependencies
For compilation:
- node.js 0.10.x
- grunt 0.4.x
- mocha 1.16.x

For usage:
- None

###Building
Run the following commands to get up to speed (assuming node, npm, grunt-cli and mocha are all installed globally)

```
npm install
grunt build
```

###Design
msngr.js is meant to be a dynamic, generic and specific messaging system that works on the client or server-side in JavaScript. Essentially the double speak means that anything sent via msngr.js has several parameters that are all optional allowing broadcast level or specific targetting of messages while allowing custom routes to be integrated for alternative message delivery and acceptance. For example someone may want to write a thrift router allowing thrift calls to be both sent and received directly through msngr.js.

###Message format
A message look like this (note: all fields except topic are optional; alternatively just a topic can be passed in instead of a message object as a string is assumed to be the topic):

```
var message = {
	topic: "Save",
	category: "User",
	dataType: "application/json",
	payload: {
		"Username": "Tester",
		"Realname": "Luke Wilson"
	}
};
```
- **topic** is a specific topic or action to broadcast about. For instance you might use "Save", "Click", "Open", etc here.
- **category** is an additional filter to categorize a specific action or topic. In this example it is showing a user wants to save.
- **dataType** should correspond (but doesn't have to) to a mimetype to allow further filtering. Should you have handlers to save or open json one way, xml another this is a great way to differentiate.
- **payload** is the data to send with the message; in this example it is the json the user wanted to save.

A result is simply the supplied payload.

###Message broadcasting and receiving
####msngr.send(message, callback);
Sends off a message to be routed to all registered receivers using the message format from above. The callback parameter is optional and is used to deliver payloads.

Example:
```
msngr.send({
	topic: "Open",
	dataType: "application/rss+xml",
	payload: myRssString
});
```

Alternatively if a simple signal with no payload is required the follow example can be used:

```
msngr.send("Play");
```
This will be received by recipients with the topic of "Play".

Wildcards can also be used to allow broader matching and work on topic, category and dataType fields.

Example:
```
msngr.send({
	topic: "Open",
	dataType: "application/*",
	payload: myRssString
});
```

####msngr.receive(message, callback);
The same message format is also used for receiving messages with the only difference is the missing payload as those are handled in the supplied callback

###Message routers
All messages are processed inside of objects known as routers. Routers allow specialized processing of messages depending on the use case along with resolution for processing result messages.

***Documentation regarding creating a router will be forthcoming.***

###msngr.extend(Object, target)
A routine that will extend an object with a new object. The target parameter is optional and when omitted will default to the msngr object.

Example:
```
msngr.extend({
	HelloWorld: function () {
		console.log("Hello, World!");
	}
});
msngr.HelloWorld();
```
