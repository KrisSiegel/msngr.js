#msngr.js
[![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/)

msngr.js is a small library used to facilitate communications through messages rather than direct binding. This loose coupling allows connecting components to each other or to UI components in an abstract way on the server or the client.

##Quick Start
The fastest way to a Hello, World!

1. Include or require ```msngr.js``` or ```msngr.min.js``` in the browser or a node.js application.
2. Register a receiver by calling ```msngr.register(message, callback)```.
3. Send a message by calling ```msngr.emit(message)```.

Here's a complete example
```
var msngr = require("msngr");
msngr.register("HelloWorld", function () {
    console.log("Hello, World!");
});

msngr.emit("HelloWorld");
```
##API
Below are the typically used API calls for an application consuming msngr; for more information regarding extending msngr then head down to the next section. There are also additional utility APIs available that are typically used internally but are exposed for general consumption.

###msngr.register(message, callback, context);
Sets up the receiver that will handle matching messages. The receiver can use wildcards (*) in the message object itself and will receive all matching messages.

```
msngr.register({
    topic: "Save",
    category:"Form"
    }, function () {
        console.log("Save Form");
});
```

###msngr.emit(message);
Sends a specific message object which can optionally contain a payload. Send should NOT use any wildcard characters as sending should always be explicit and known where as receiving can be more general and lax.

```
msngr.emit({
    topic: "Save",
    category: "Form",
    dataType: "application/json",
    payload: {
        name: "Kris",
        description: "Software developer"
    }
});
```

###msngr.unregister(identifier);
Removes a specific receiver by supplying the callback (identifier) of the receiver.

###msngr.bind(element, event, message);
Provides a way to bind directly to an element. Bind provides a generic interface which can then hook into multiple implementations including the default DOM (Document Object Module) binder which allows elements to be HTML elements, events to be appropriate events for the supplied element and the message object to be sent when the event triggers.

The usage here is meant to separate eventing from the UI itself to allow the UI to be completely changed (theoretically allowing a web application to be transitioned into an application hooking into native graphics APIs without changing the event handling code).

```
msngr.bind("#MyButton", "click", {
    topic: "Save"
});
```

###msngr.unbind(element, event, message);
Simply unbinds the element, event and message tuple.

##Extending msngr.js
msngr was designed to be extensible with the way it was architected. It has no dependencies, building is done through simple grunt commands, extending existing interfaces simply requires using a registry of objects and it has its own extend method to allow msngr to be extended in any way a developer may want.

###Building msngr.js
Building requires that the development dependencies from npm to be installed (running ```npm install```) in addition to the grunt-cli being installed into the system (run ```npm install -g grunt-cli```). Building cleans the ```msngr.js``` and ```msngr.min.js``` files, applies the version number specified in ```package.json```, generates new ones from all of the source code within the ```./src/``` directory and updates the ```specRunner.html``` file dynamically with any new unit tests that may have been added.

Simply run ```grunt build``` to build msngr.js.

Note: running 'grunt' by itself will produce an available set of commands and their descriptions.

###Testing msngr.js
Testing is conducted directly using node and phantomjs for client related tests. Unlike many JavaScript projects I decided to use the GO model of testing meaning each unit test sits directly next to the file it is testing (so there is no test or spec directory). There are also 3 different naming conventions for spec files.

- *.aspec.js - A spec file that can be run directly within node.js or a web browser.
- *.cspec.js - A spec file that can ONLY be run inside of a web browser.
- *.nspec.js - A spec file that can ONLY be run inside of node.js.

The reasoning for the different conventions is simple: msngr.js is meant to work in as many environments as possible however some features (such a DOM binding) are only available in very specific environments all of which need automated unit testing.

###Stress testing msngr.js
Stress testing is important especially when the library is in charge of all local and possibly even remote communications between components. Stress testing is somewhat similar to how unit testing works; stress tests exist in the ```./stress/``` directory and are named using the ```*.stress.js``` convention.

Stress tests are run using [benchmark.js](http://benchmarkjs.com/) in a custom context. Unlike mocha testing, stress tests are simply scripts that run via node. There is a familiar interface to running async mocha unit tests in that some data is passed into the stress test and at the end ```done()``` should be called. The best example is looking at how the indexer stress tests were created which is in the ```./stress/msngr.utils.indexer.stress.js``` file.

A basic example of a stress test is as follows [which would simply do into a ```*.stress.js``` file in the ```./stress/``` directory]:

```

module.exports = (function (done) {
    var benchmark = require("benchmark");

    var stress = (function (description, msngr, uniqueKey) {
        var suite = new benchmark.Suite;
        suite.add("test", function () {
            var answer = 5 * 5;
        });

        suite.on("cycle", function (event) {
            console.log(String(event.target));
        });

        suite.run({ "async": false });

        done();
    });

    stress("A stress example", require("../msngr.js"), Math.floor(Math.random() * 1000));
});

```

To run the stress tests simply run ```grunt stress```.

###Routers versus Binders
There are two ways to extend how msngr handles sending, receiving and binding. Routers are used for standard messages across the system whereas binders are used for binding directly to a component (typically part of the user interface). Routers are more general and can be used in all environments but binders provide an easy way to hook HTML elements and their events directly into msngr's messaging.

A router must be a JavaScript object and must implement the following interface (a domain can be 'local' or 'localAndRemote' depending on if it's working within the local environment or doing both local and remote):
```
{
    emit: function (message) { },
    register: function (message, callback, context) { },
    unregister: function (identifier) { },
    domain: "<string>"
}
```

A binder must be a JavaScript object and must implement the following interface (domain should always be 'local' for binders):
```
{
    bind: function (element, event, message) { },
    unbind: function (element, event, message) { },
    domain: "<string>"
}
```

The methods used for registering routers and binders are identical but namespaced and are as follows:

####msngr.register.routers.add(router); msngr.register.binders.add(router);
Adds a router or binder to the registry.

####msngr.register.routers.get(index); msngr.register.binders.get(index);
Gets a router or binder from the registry at the specified index.

####msngr.register.routers.count(); msngr.register.binders.count();
Counts the amount of registered routers or binders in the registry.

####msngr.register.routers.unregister(index); msngr.register.binders.unregister(index);
Removes the router or binder at the specified index.

###msngr.extend(source, target);
Mixes the source into the target object. If target is elided then the target becomes the msngr object. Source attributes overwrite target attributes and arrays are combined (there is no way to get fewer items within an array after extending).

##Utility APIs
Below are some APIs used, mostly internally, that are exposed for general consumption.

###msngr.utils.ensureMessage(message);
Takes any input and attempts to return a valid message object.

###msngr.utils.argumentsToArray(args);
Takes a JavaScript arguments object and converts it to a proper array.

###msngr.utils.ThrowNotImplementedException();
Throws a not implemented exception.

###msngr.utils.ThrowRequiredParameterMissingOrUndefinedException(params);
Throws a required parameter missing or undefined exception with an array of missing or undefined params.

###msngr.utils.ThrowMismatchedInterfaceException(interface);
Throws a mismatched interface exception with interface being an optional interface name.

###msngr.utils.ThrowInvalidMessage();
Throws an invalid message exception.

###msngr.utils.ThrowEventNotFoundException();
Throws an event not found exception.

###msngr.utils.indexer.index(message, key);
The message and a unique identifying key to index.

###msngr.utils.indexer.query(message);
Queries the index for messaging matching the incoming message. Checks for partials or exact matches.

###msngr.utils.indexer.unregister(receiver);
Removes a specific item from the index by its unique key as specified when initially being added to the index.

###msngr.utils.arrayContains(arr, values);
Checks whether the ```arr``` array contains the values in the ```values``` array.

###msngr.utils.getType(obj);
Returns the type's name in the full JavaScript format of ```[object Object]```.

###msngr.utils.isNullOrUndefined(obj);
Returns whether the ```obj``` is null or undefined.

###msngr.utils.isHtmlElement(obj);
Returns whether the ```obj``` is an HTML element or not.

###msngr.utils.isNodeList(obj);
Returns whether the ```obj``` is an HTML node list or not.

###msngr.utils.isString(obj);
Returns whether the ```obj``` is a string or not.

###msngr.utils.isDate(obj);
Returns whether the ```obj``` is a date object or not.

###msngr.utils.isArray(obj);
Returns whether the ```obj``` is an array or not.

###msngr.utils.isNumber(obj);
Returns whether the ```obj``` is a number or not.

###msngr.utils.isObject(obj);
Returns whether the ```obj``` is a JavaScript object or not.

###msngr.utils.isFunction(obj);
Returns whether the ```obj``` is a function or not.

###msngr.utils.isEmptyString(obj);
Returns whether the ```obj``` is an empty string or not.

###msngr.utils.isWildCardStringMatch(string1, string2);
Returns whether the contents of ```string1``` matches ```string2``` when considering wildcard characters.

###msngr.utils.isValidMessage(message);
Returns whether the ```message``` object is a valid message or not.

###msngr.utils.isMessageMatch(sent, target);
Returns whether the sent message matches a target message or not.

###msngr.utils.doesMessageContainWildcard(message);
Returns whether the message contains wildcard characters or not.

###msngr.utils.getPropertiesWithWildcards(message);
Returns all properties associated with the ```message``` object where they contain wildcard characters.

Copyright (c) 2014 Kris Siegel
