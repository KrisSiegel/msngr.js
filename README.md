# msngr.js
[![npm version](https://badge.fury.io/js/msngr.svg)](http://badge.fury.io/js/msngr) [![Bower version](https://badge.fury.io/bo/msngr.js.svg)](http://badge.fury.io/bo/msngr.js) [![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/) [![Dependency Status](https://gemnasium.com/KrisSiegel/msngr.js.svg)](https://gemnasium.com/KrisSiegel/msngr.js)

msngr.js is a small library to manage messages between components with the goal of isolating business logic from a user interface or server framework. For example messages can be bound directly to DOM elements and activities can gather values allowing the handling of click events to know absolutely zero about the user interface itself.

What does that mean, exactly? Read on. Want to just jump right in? Check out [this jsfiddle](http://jsfiddle.net/jnjaosfz/) page with msngr.js already included with a "Hello, World!" example.

### Quick note regarding upcoming 2.x release
The 2.0 branch of msngr is feature complete and includes a very different API than the current 1.x version. This was necessary to ensure consistency and an easier to use API. Additional testing, benchmarking and documentation need to be completed before 2.0 is fully ready for release at the end of May. If you'd like a preview take a look at the [2.0.0 branch](https://github.com/KrisSiegel/msngr.js/tree/2.0.0).

## Quick Start
Installation can occur via bower or npm (alternatively just download msngr.js or msngr.min.js).

```batch
bower install msngr.js
```

```batch
npm install msngr
```

Once installed simply include it into your project.
```html
<script type='text/javascript' src="msngr.min.js"></script>
```

```javascript
var msngr = require("msngr");
```

Now you're ready to start messaging!

### Binding messages to DOM elements
One of the most handy things msngr.js can do is bind a message directly to a DOM element. Let's look at the following example.

index.html
```html
<input type="text" name="Name" />
<br />
<input type="text" name="Email" />
<br />
<input type="submit" name="Save" />
```

userinterface.js
```javascript
msngr.bind("input[type=submit]", "click", "Profile", "Save");
```

business.js
```javascript
msngr.on("Profile", "Save", function () {
    console.log("The profile has been saved!");
});
```

As you can see ```msngr.bind()``` can accept typical selectors, an event and then a message which can be made up of a topic, category and dataType (omit the ones you do not want to use).

So this is cool, the UI and the frontend can be separated, right? Well how do you get those name and email values? Put DOM accessing code in business.js? Heck no! You can use the DOM activity to specify what values should be grabbed.

index.html
```html
<input type="text" name="Name" />
<br />
<input type="text" name="Email" />
<br />
<input type="submit" name="Save" />
```

userinterface.js
```javascript
msngr.bind("input[type=submit]", "click", {
    topic: "Profile",
    category: "Save",
    dom: ["input[name=Name]", "input[name=Email]"]}
);
```

business.js
```javascript
msngr.on("Profile", "Save", function (payload) {
    console.log(payload.Name);
    console.log(payload.Email);
});
```

Now the payload will include an object with the values of each input specified. You can even simplify the selector even more to get the same data back like so:

```javascript
msngr.bind("input[type=submit]", "click", {
    topic: "Profile",
    category: "Save",
    dom: ["input"]
});
```

Aggregated values are always stored with their name as the key. If the name doesn't exist then it uses an id. Should an id not exist then it defaults to tagname + count (so "input0", "input1");

### What about JavaScript that doesn't touch the DOM?
So msngr.js can also be used outside of situations that involve the DOM and be just as handy! A common example is abstracting away a specific library through the use of messages. An example is outlined below.

elasticsearch.js
```javascript
msngr.on("Profile", "Save", "application/json", function (payload) {
    // Save profile object into ElasticSearch
});
```

business.js
```javascript
msngr.emit("Profile", "Save", "application/json", profile);
```

So in the example above we can save a Profile object without actually knowing who or what is going to save this. This let's us to, later on, use a configuration to allow alternative data stores such as a Mock store without changing the business.js file. So that may look like:

mock.js
```javascript
msngr.on("Profile", "Save", "application/json", function (payload) {
    // Save profile object into a mock data store
});
```

### So what are activities anyway?
An activity is simply a registered method, executed synchronously, designed to be called before payload delivery should any properties within the message object match the registered method's property.

For example the built-in DOM activity is registered with the 'dom' property. Therefore anytime someone emits a message with the 'dom' property the registered method is called before being delivered. This allows extending msngr.js in various ways without changing any method signatures.

For instance if you want to create an activity that added two numbers together.

```javascript
msngr.action("add", function (message, wrap) {
    wrap.payload.result = wrap.payload.number1 + wrap.payload.number2;
});

msngr.on("Addition", function (payload) {
    console.log(payload.result); // Outputs 7
});

msngr.emit({ topic: "Addition", add: { } }, { number1: 5, number2: 2 });
```

Note that what is typically supplied to the action's property in the message object is any related options the particular action may need. In this add example nothing was necessary so an empty object was passed in but for others, such as the dom action, you would pass in an array of html selectors.

## API
Below are the methods exposed via the msngr object, their parameters and return values.

#### msngr.on(message, function) / msngr.on(topic, category, dataType, function)
This method accepts a JavaScript object with the properties "topic", "category" and "dataType" or simply fill in the first 3 parameters with those values. The function is a callback that's executed when a matching message is received and provides a payload parameter.

#### msngr.emit(message, payload) / msngr.emit(topic, category, dataType, payload)
This method sends a message by either providing a JavaScript object with the properties "topic", "category" and "dataType" or by simply entering each values as a parameter. The payload can be anything you want to send to a receiving callback.

#### msngr.drop(message, handler) / msngr.drop(topic, category, dataType, handler)
This method removes a message from being executed. Specify the handler to remove or drop all handlers by specifying undefined.

#### msngr.bind(element, event, message) / msngr.bind(element, event, topic, category, dataType)
This method takes an HTML element (can be an element or selector), an event and a message then binds all 3 together. When the specified event occurs on the element the message will be emitted. Optionally add the 'dom' property to the message object to supply selectors you wish msngr would gather values from and return in the payload.

#### msngr.unbind(element, event) / msngr.unbind(element, event)
This method stops an element's event from emitting a previously bound message.

#### msngr.action(property, function)
This method provides a way of extending msngr. The property is anything (except for 'topic', 'category' or 'dataType') that is supplied within a message object. If a message is emitted with a matching property the function is called with the message and an object that allows stopping the emitting entirely (via calling ```obj.preventDefault()```) or modifying the payload itself.

#### msngr.inaction(property)
This method removes the action being called on a property.

Copyright © 2014-2015 Kris Siegel
