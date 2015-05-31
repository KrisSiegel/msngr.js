# msngr.js
[![npm version](https://badge.fury.io/js/msngr.svg)](http://badge.fury.io/js/msngr) [![Bower version](https://badge.fury.io/bo/msngr.js.svg)](http://badge.fury.io/bo/msngr.js) [![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/)

## What is msngr.js?
msngr.js is a small library for facilitating communication between components through abstract messages within the same application be it server or client side. It also provides binding messages directly to DOM elements and even sending payloads between browser tabs / windows.

The following example shows how to bind a message to a click event of a DOM element while gathering up the values in the related inputs for payload delivery.

```HTML
<input type="text" name="Username" value="Kris" />
<input type="password" name="Password" value="hunter2" />
<button>Submit</button>
```

```javascript
msngr("User", "Save")
    .bind("button", "click")
    .option("dom", ["input"])
    .on(function (payload) {
        console.log(payload.Username); // Prints "Kris"
        console.log(payload.Password); // Prints "hunter2"
    });
```

## Getting msngr.js
If you want to use msngr.js on the server-side via npm simply install it via ```npm install msngr```.

If you want to use it within a web browser then either install via ```bower install msngr``` or manually download msngr.js or msngr.min.js file(s) from this repository.

## Would you like to know more?
While msngr.js isn't very large the documentation has been split up for easy reading.

[Full API](docs/api.md) - This is the full, exposed API that msngr makes available. This includes the methods that can be used (it does not cover internal methods or objects since those are subject to change) and examples for each.

[Messaging patterns](docs/messaging patterns.md) - Explains how to use the basic messaging features of msngr.js with some typical patterns.

[Web browser niceties](docs/web browser niceties.md) - This covers binding msngr.js to elements and events, unbinding them, how to gather up values from various types of elements and cross-window communication.

[Extending and hacking](docs/extending and hacking.md) - Want to extend the capabilities of msngr.js? It's actually quite easy and this document covers it. Using msngr.js deep in a production system then suddenly find *something* that you need to change to avoid catastrophe? Hacking msngr.js is also covered for those times when you need *unorthodox* solutions :)

[Contributing](docs/contributing.md) - Want to contributed to msngr.js? There are a couple of things you should know before you submit that pull request to better ensure it gets accepted :)

## Roadmap
The current release of msngr.js works in node.js for server-side messaging as well as the web browser. The web browser has some extra features like messaging between windows and binding to DOM elements but future features will receive more focus on the core of msngr.js with more node.js fun!

### What's Next?
Below is what's being worked on for future 2.x releases.

* Web Socket Messaging - Easy web socket communication with messages between a server and client.

* Feature detection - Support verifying what certain features can work in the environment they're in (e.g. older web browsers). When they cannot log a warning and disable the feature (warnings will be toggle-able).

* Better browser support - Currently msngr.js should work in most current web browsers but some features may not work well in older versions of Internet Explorer and really old versions of Firefox. Additional testing and tweaking needs to be conducted for older browser support and to provide a baseline for what is or isn't supported.

* Benchmarking and optimization - Now that the majority of msngr.js's structure is written and fairly solidified we need to begin benchmarking along with profiling and optimization. Optimization had previously been ignored while the API was finalized and while msngr.js is really fast it needs to be *scientifically* fast.

### What's Next Next?
At this point further planning will occur once more community feedback comes through. I have a few ideas involving integration into other messaging systems, some streaming ideas and a few optional extensions that provide message based APIs for other libraries but I'm hesitant to *only* go in one direction should other needs arise.

For questions, news, and whatever else that doesn't fit in GitHub issues you can follow me [@KrisSiegel](https://twitter.com/KrisSiegel)

Copyright © 2014-2015 Kris Siegel
