# msngr.js
[![npm version](https://badge.fury.io/js/msngr.svg)](http://badge.fury.io/js/msngr) [![Bower version](https://badge.fury.io/bo/msngr.js.svg)](http://badge.fury.io/bo/msngr.js) [![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/) [![Dependency Status](https://gemnasium.com/KrisSiegel/msngr.js.svg)](https://gemnasium.com/KrisSiegel/msngr.js)

## What is msngr.js?
msngr.js is a small library for facilitating communication between components through messages. Messages can be sent and received between any JavaScript code within the browser or server-side with node or io.js. Messages can also be bound to DOM elements and their specific events to allow for loose coupling of the user interface to your application logic.

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

## Would you like to know more?
While msngr.js isn't very large the documentation has been split up for easy reading.

[Messaging patterns](docs/messaging patterns.md) - Explains how to use the basic messaging features of msngr.js with some typical patterns.

[Binding and the DOM](docs/binding and the dom.md) - This covers binding msngr.js to elements and events, unbinding them and how to gather up values from various types of elements.

[Extending and hacking](docs/extending and hacking.md) - Want to extend the capabilities of msngr.js? It's actually quite easy and this document covers it. Using msngr.js deep in a production system then suddenly find *something* that you need to change to avoid catastrophe? Hacking msngr.js is also covered for those times when you need *unorthodox* solutions :)

[Just give me the damn API](docs/api.md) - So you just want what method(s) are exposed and the parameters required to make them go? Fine don't read my witty and informative documentation and just look at this. I won't be upset...

For questions, news, and whatever else that doesn't fit in GitHub issues you can follow me [@KrisSiegel](https://twitter.com/KrisSiegel)

Copyright © 2014-2015 Kris Siegel
