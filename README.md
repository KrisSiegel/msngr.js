# msngr.js
[![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/) [![Dependency Status](https://gemnasium.com/KrisSiegel/msngr.js.svg)](https://gemnasium.com/KrisSiegel/msngr.js)

msngr.js is a small library used to facilitate communication through messages rather than direct binding. This loose coupling allows connecting components to each other or to UI components in an abstract way on the server or the client.

## Quick start
msngr.js can be used within a web browser or a node application so instead of reading boring documentation let's just jump into both!

### Web browser
For a web browser you need to either download msngr.js the old fashion way or use bower (```bower install msngr```). Once downloaded include msngr.js in your web application.
```
<script type='text/javascript' src="msngr.js"></script>
```

Once included a msngr object will be created and placed at the window level for easy access throughout your application. Now let's look at a quick example of binding a client event to a specific message.

index.html
```
<button id="MyButton">Click me!</button>
```

index.js
```
msngr.bind("#MyButton", "click", { topic: "Click" });

msngr.register({ topic: "Click" }, function (payload) {
    console.log("The button was clicked!");

    msngr.unbind("#MyButton", "click");  
});
```

### node.js application
So node doesn't have HTML elements to bind to but messaging is still a powerful way to decouple things. Messaging in this context can work in both node and the web browser. To get started with node first install msngr.js via npm (```npm install msngr```). Once installed simply include it in the file(s) you want to use it in.
```
var msngr = require("msngr");
```

Now the real fun begins. Here's an example of sending and receiving a message.
```
msngr.register({ topic: "Save", category: "Profile", dataType: "application/json" }, function (payload) {
    console.log("Save profile information here");
});

msngr.emit({ topic: "Save", category: "Profile", dataType: "application/json" }, {
    name: "Kris",
    country: "United States"
});
```

## The API [in all its glory]
So now that we've gone through a few examples let's dive into the API (which is pretty minimal) so a full reference is available.

### Message format and rules
All messages are simply JSON objects that can contain 3 fields: topic, category and dataType. The topic field is **always** required but category and dataType are optional and are meant to provide more specific ways of handling messages.

A good rule of thumb is to always send as many of the 3 fields as possible when emitting data but receiving can be a little more open ended. For instance you may have a method to save a profile but it can handle multiple types so dataType can be omitted. However, ensuring the correct dataType is still emitted makes future updating and specialization much easier. You should always know what you're sending but not necessarily what you're receiving.

An example of a message.
```
{
    topic: "MyTopic",
    category: "MyCategory",
    dataType: "MyDataType"
}
```

### msngr.emit(message, payload)
Emit sends a message, which should be as descriptive as possible, along with a payload to any registered callbacks.

Example
```
msngr.emit({ topic: "MyTopic", category: "MyCategory", dataType: "text"}, "Test");
```

### msngr.register(message, callback)
Register a callback to a specific message. For registration a message should be as simple as possible (meaning omitting category and / or dataType when specialization is not necessary). The callback receives a payload from the message sending.

Example
```
msngr.register({ topic: "MyTopic", category: "MyCategory" }, function (payload) {
    // Code that handles the payload goes here
});
```

### msngr.unregister(message)
Unregisters all callbacks that match the message passed in.

Example
```
msngr.unregister({ topic: "MyTopic" });
```

### msngr.bind(element, event, message) *(web browser only)*
Bind provides a way of taking traditional HTML elements and attaching a message to their events to allow a full separation between the user experience and the business logic. An element can be a valid HTML element or a selector to an element. An event must be an event the element supports and the message is what you wish to be emitted when the event occurs.

Example
```
msngr.bind("#MyButton", "click", { topic: "Click" });
```

### msngr.unbind(element, event) *(web browser only)*
Unbind provides a way to remove a message from being bound to an event of an element. This is useful in avoiding memory leaks.

Example
```
msngr.unbind("#MyButton", "click");
```

Copyright (c) 2014-2015 Kris Siegel
