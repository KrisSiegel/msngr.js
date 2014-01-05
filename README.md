#msngr.js

A natural way to write decoupled JavaScript code using messages rather than direct eventing which lends well to developing intercommunication between web components.

###Dependencies
For compilation:
- node.js 0.10.x
- grunt 0.4.x
- mocha 1.16.x

For usage:
- N/A

###Building
Run the following commands to get up to speed (assuming node, npm, grunt and mocha are all installed globally)

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
	target: "550e8400-e29b-41d4-a716-446655440000",
	payload: {
		"Username": "Tester",
		"Realname": "Luke Wilson"
	}
};
```
- **topic** is a specific topic or action to broadcast about. For instance you might use "Save", "Click", "Open", etc here.
- **category** is an additional filter to categorize a specific action or topic. In this example it is showing a user wants to save.
- **dataType** should correspond (but doesn't have to) to a mimetype to allow further filtering. Should you have handlers to save or open json one way, xml another this is a great way to differentiate. 
- **target** is a very specific id used when registering a message receiver and allows direct targetting to said receiver rather than letter multiple receive a message. This would typically not be used but allows specific targetting when necessary.
- **payload** is the data to send with the message; in this example it is the json the user wanted to save.

A message result object looks like this:

```
var result = {
	message: message,
	results: []
};
```
- **message** the original message object (for large payloads this can be pruned when registering receivers; callbacks are automatically pruned)
- **results** an array of results which can vary based upon the response of the receiving handlers

###Message broadcasting and receiving
####msngr.send(messageObject, callback);
Sends off a message to be routed to all registered receivers using the message format from above. The callback parameter is optional and is used to deliver message result objects from all receivers.

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

Wilcards can also be used to allow broader matching and work on topic, category and dataType fields.

Example:
```
msngr.send({
	topic: "Open",
	dataType: "application/*",
	payload: myRssString
});
```

Finally an example using the callback:
```
msngr.send({
	topic: "Open",
	dataType: "application/rss+xml",
	payload: myRssString
}, function (result) {
	console.log(result.message);
});
```

####msngr.receive(messageObject, callback);
The same message format is also used for receiving messages with the only difference is that an option of ```trimPayload``` works here to ensure that payloads are stripped when received to cut down on data being passed around.

###Message routers
All messages are processed inside of objects known as routers. Routers allow specialized processing of messages depending on the use case along with resolution for processing result messages.



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