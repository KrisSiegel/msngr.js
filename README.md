# msngr.js
[![npm version](https://badge.fury.io/js/msngr.svg)](http://badge.fury.io/js/msngr) [![Bower version](https://badge.fury.io/bo/msngr.svg)](http://badge.fury.io/bo/msngr) [![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/) [![Dependency Status](https://gemnasium.com/KrisSiegel/msngr.js.svg)](https://gemnasium.com/KrisSiegel/msngr.js)

msngr.js is a small library to manage messages between components with the goal being the ability to create an application that can completely separate business logic from the user interface or server frameworks. For example messages can be bound directly to DOM elements and activities can gather values allowing the handling of click events to know absolutely zero about the user interface itself.

What does that mean, exactly? Read on.

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
msngr.bind("input[type=submit]", "click", "Save", "Profile");
```

business.js
```javascript
msngr.on("Save", "Profile", function () {
    console.log("The save button was clicked");
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
    topic: "Save",
    category: "Profile",
    dom: ["input[name=Name]", "input[name=Email]"]}
);
```

business.js
```javascript
msngr.on("Save", "Profile", function (payload) {
    console.log(payload.Name);
    console.log(payload.Email);
});
```

Now the payload will include an object with the values of each input specified. You can even simplify the selector even more to get the same data back like so:

```javascript
msngr.bind("input[type=submit]", "click", {
    topic: "Save",
    category: "Profile",
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

For example the built-in DOM activity is registered with the 'dom' property. Therefore anytime someone emits a message with the 'dom' property the registered method is called before being delivered. This allows to extending msngr.js in various ways without changing any method signatures.

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

## API
Below are the methods exposed via the msngr object, their parameters and return values.

#### msngr.on(message, function) / msngr.on(topic, category, dataType, function)

#### msngr.emit(message, payload) / msngr.emit(topic, category, dataType, payload)

#### msngr.drop(message) / msngr.drop(topic, category, dataType)

#### msngr.bind(element, event, message) / msngr.bind(element, event, topic, category, dataType)

#### msngr.unbind(element, event) / msngr.unbind(element, event)

#### msngr.action(property, function)

#### msngr.inaction(property)

Copyright © 2014-2015 Kris Siegel
