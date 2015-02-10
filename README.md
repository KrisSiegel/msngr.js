# msngr.js
[![Build Status](https://travis-ci.org/KrisSiegel/msngr.js.svg)](https://travis-ci.org/KrisSiegel/msngr.js/) [![Dependency Status](https://gemnasium.com/KrisSiegel/msngr.js.svg)](https://gemnasium.com/KrisSiegel/msngr.js)


msngr.js is a small library used to facilitate communication through messages rather than direct binding. This loose coupling allows connecting components to each other or to UI components in an abstract way on the server or the client.

## Quick Start
Documentation is boring so let's just jump into using msngr.js.

* Install for node applications with ```npm install msngr``` or download ```msngr.min.js``` for web pages.

* ```var msngr = require("msngr")``` in your node application or include ```msngr.min.js``` in your web page.

* Register a message receiver like so:
```
msngr.register({ topic: "Hello" }, function(payload) {
    console.log(payload);
});
```
* Emit a message to be received like so:
```
msngr.emit({ topic: "Hello" }, "Hello, World!");
```
* You're done 

Alternatively use the ```bind()``` method to tie an event to a  message and truly separate your user experience and your business logic!

## API
*PENDING*

Copyright (c) 2014-2015 Kris Siegel
