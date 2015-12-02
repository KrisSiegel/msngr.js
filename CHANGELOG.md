# Changelog
This is a roll-up of all release notes in order of release

## [Release 3.2.2 - December 2, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.2.2)
- Ugh, forgot to add new bower and npm ignores for the test-resources directory so there are added here

## [Release 3.2.1 - December 2, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.2.1)
- Minor fix to hyperlinks in README.md

## [Release 3.2.0 - December 2, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.2.0)
- Fixed a bug in ```msngr.querySelectorAllWithEq()``` where more than one :eq() would create an invalid selector
- Revised ```msngr.getDomPath() ```to properly return a DOM path instead of just adding an ID. If an ID exists that is simply returned as the selector
- Revised ```msngr.findElement()``` / ```msngr.findElements()``` to use querySelectorAllWithEq() for consistency
- Moved test resources to a dedicated folder for neatness

## [Release 3.1.1 - November 15, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.1.1)
- Heavily revised README
- Added CHANGELOG for tracking release information
- Revised package.json to better suit the current capabilities

## [Release 3.1.0 - November 11, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.1.0)
- Makes message topics, categories and subcategories case insensitive
- Adds sending of headers in msngr.net()
- Added property getters for topic, category and subcategory onto the message object itself
- Added memory object benchmarks

## [Release 3.0.1 - November 8, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.0.1)
Well that was fast!

- Removed deep copying attempts for all payloads (this was a terrible idea anyway)
- Tweaked documentation

## [Release 3.0.0 - November 8, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/3.0.0)
The wait is over as version 3.0.0 has arrived! Okay, a little overblown but this version has good stuff in it including optimizations that speed up message handling **2x** to **5x** depending on environment! Since msngr follows semantic versioning 3.x has breaking changes from 2.x which are outlined in these release notes.

***What's new?***
- A new ```msngr.net()``` interface that provides a single, unified way of hitting HTTP and HTTPS endpoints. This means it works in both the web browser and node.js.
```javascript
var request = msngr.net("http://www.myexample.org");
request.get({
    path: "/search",
    query: {
        term: "dogs"
    }
}, function(error, result) {
    console.log(result);
});
```

- ```msngr.config()``` provides an easy way to specify configurations for different parts of msngr. For instance some of the defaults for ```msngr.net()``` are simply configuration items that a developer can then override. The same goes for the channel used in the ```cross-window``` option. More details in the documentation.

- ```msngr.copy()``` provides a way to deep copy objects. Any type of object it doesn't understand to deep copy is simply returned as is (so it's a quasi deep copy but it's difficult to get better than that while also being useful).

- ```msngr.immediate()``` provides the fastest way possible, in the currently running environment, to execute a method asynchronously. This is a huge performance boost as previously msngr was using setTimeout which was slow in node.js and *supremely* slow in the browser.

- ```isBrowser()``` provides a check to determine if we're operating in a web browser of not.

***Breaking changes (improvements++)***
- ```msngr().on()``` now sends the callback 3 parameters: ```payload, message, async```. In 2.x msngr sent two (```payload, async```).

- ```msngr.options()``` is now gone; there are no more global options as this made options being applied too implicit.

- ```msngr.executer().execute()``` method has been removed as it only executed the first item of the supplied methods without being explicit about it. Implicit behavior for the lose.

- ```msngr.executer()``` no longer takes the params of ```methods, payload, context```. Now it accepts either an array of just functions *or* an array of objects with each object following the format of: ```{ method: function() {}, params: [], context: this }```. This allows executer to be more flexible with supplying n number of parameters to each method of which the params can all be different (and executer simply appends its async method as the last parameter of each function call just like before)

- Creating options now works a lot nicer; instead of directly modifying the internal object you, instead, call a method and supply it with the necessary parameters. No more worrying about messing up the internal structure :). It now looks like this:
```javascript
msngr.extend(function(external, internal) {
    internal.option("my-option", function(message, payload, options, async) {
        // code here
    });
});
```

- ```msngr.hasWildCard()``` is now gone. It wasn't being used and was a hold out from 1.0.

***Notables***
- ```msngr.now()```'s legacy fallback now uses ```Date.now()``` instead of ```Date.getTime()```.

- msngr now has benchmarks! To execute run ```npm run benchmark```. This will execute benchmarks in node.js as well as update two html files that allow benchmarks to be run in the browser. Note: the browser benchmarks currently do not automatically run like the unit tests; this will be rectified in a future, minor release.

## [Release 2.4.1 - October 11, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.4.1)
Added subscribers count property

## [Release 2.4.0 - October 11, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.4.0)
This release rewrites the memory indexer internal to msngr which was necessary for a bug fix.

- Fixed issue where subscribing to less message pieces than which is emitted would not call the handler
- Added a deduping method for arrays and relevant documentation

## [Release 2.3.0 - October 7, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.3.0)
This is a fairly minor release just addressing some much needed items

- Executer object is now exposed and let's you run n number of functions in parallel similar to async.js (this was written and originally kept internal to avoid bringing in additional dependencies; now that it's pretty solid figured it should be exposed as a utility)
- Minor source code clean-up with beautifier
- Removed grunt-cli global dependency

## [Release 2.2.2 - October 7, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.2.2)
Added ignore to bower.json which should improve the bower install experience :)
Also updated dev dependencies

## [Release 2.2.1 - September 20, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.2.1)
Added a .npmignore file

## [Release 2.2.0 - September 20, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.2.0)
- Updated API to use subcategory instead of dataType. Didn't change the major version as this, while a fundamental change, won't break any existing code.
- Updated dev dependencies
- Added node v4 as a build target in travisci

## [Release 2.1.1 - July 6, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.1.1)
Fixes minor build issue that was found during 2.1.0 due to a new issue in the mocha-phantomjs module. This has zero affect on using msngr.js itself just in building and testing.

## [Release 2.1.0 - July 5, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.1.0)
Added support for setting global options that get applied to all messages

## [Release 2.0.1 - June 14, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.0.1)
Fixed issue where merging arrays did not deduplicate them when some values were shared.

## [Release 2.0.0 - May 31, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/2.0.0)
The 2.0 release is finally here. There are many breaking API changes and lots of new features!

* Now create messages via ```msngr("Topic", "Category", "DataType");``` which then returns a message object you can then handle and emit.
* Persist data so future handler additions receive the same message.
* Use ```option("cross-window")``` to allow your messages to cross tabs and windows within your web browser for the same domain (useful for multiple instances of a single web application).
* All utilities now moved to directly top level
* More utilities added that allow you to test multiple things at once. Example: ```msngr.isString("me");``` and ```msngr.areStrings("me", "yup", "weee");```.
* EXTENSIVE documentation including the full exposed API, messaging patterns, browser features, how to extend and hack msngr.js and even rules about contributions.

## [Release 1.1.0 - April 24, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/1.1.0)
- Added support for msngr.drop(message, handler) / msngr.drop(topic, category, dataType, handler) to allow individual handlers to be targeted versus a scorch-the-Earth removal as before. (Fixes #24)
- Added more code coverage for accidental omissions.
- Added multiple utility methods; is<Type>() does single checking and as<Type>() will check all arguments to ensure same type. The odd man out is the addition of msngr.utils.exist() and exists(); exist for single and exists for multiple.
- Dev dependency updates
- Added unit tests to run against minified file to ensure good minfication.

## [Release 1.0.0 - March 15, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/1.0.0)
- Several APIs have been broken from previous releases due to them being < 1.0.0. This is the 1.0.0 release so further breakage won't occur until possible, future, major revisions.
    - msngr.on replaces msngr.receive
    - multiple methods now allow the creation of message objects via parameters versus always using a JavaScript object
- Far more unit test coverage
- Far better documentation with examples
- Actions are now a thing; actions allow messages to be extended by anyone and provide ways of intercepting, preventing and modifying message payloads
- Binding works far better, implicit ID handling is gone and the use of selectors is now exclusive
- Multitude of bugs fixed with unit tests added covering them

## [Release 0.5.0 BETA - February 11, 2015](https://github.com/KrisSiegel/msngr.js/releases/tag/0.5.0)
This is the first beta of msngr.js! Significant improvements are included in this release including:

- Major refactoring to eliminate a lot of code and to make the codebase easier to maintain
- Full unit test coverage of important msngr.js APIs
- Improved delegate indexing to allow better and faster message matching
- Revised documentation to make jumping into msngr.js easier

## [Release 0.4.0 ALPHA - October 9, 2014](https://github.com/KrisSiegel/msngr.js/releases/tag/0.4.0)
Resolved issue with DOM binding and unbinding.

## [Release 0.3.0 ALPHA - September 14, 2014](https://github.com/KrisSiegel/msngr.js/releases/tag/0.3.0)
- Replaced internal indexer to index fields versus the original table-scan-like query it previously did; this means performance will not deteriorate as user of msngr increases except in the case of using partials (which will be revisited before GA).

- Revised unit testing strategy to place unit tests within each testing target's directory.

- Removed stress testing as it gave false indicators at best and failed at worst. Will be revisited before GA.

## [Release 0.2.0 ALPHA - July 23, 2014](https://github.com/KrisSiegel/msngr.js/releases/tag/0.2.0)
This release has breaking changes!

- Revised API to use emit instead of send, register instead of receiver and unregister instead of remove for consistency.
- Revised unit testing strategy to support testing client-side binders directly through node using phantomjs; travis now runs all unit tests, where possible, in the node and browser contexts.
- Added domain support for emitting and routing; routers are now required to include a domain property that will either be "local", "remote" or "localAndRemote". emitters will not be required to use them and will default to "local". This will provide support in the upcoming releases for targeting different types of routers.
- Simplified multiple aspects of the code by dropping interfaces and reorganizing.

## [Release 0.1.0 ALPHA - July 11, 2014](https://github.com/KrisSiegel/msngr.js/releases/tag/0.1.0)
This is the first release of a fairly functional msngr.js library. It is not yet recommended for production use.

This release includes:
* The addition of binders to support binding elements and their events to specific messages.
* Addition of stress testing using benchmark.js.
* Revised build process that generates appropriate spec runner html file for client side testing along with continuing the node side of testing.
* Revised unit tests to use chai instead of node's assert.

## [Release 0.0.1 ALPHA - April 26, 2014](https://github.com/KrisSiegel/msngr.js/releases/tag/0.0.1)
Initial capability to send and receive messages with optional wildcards and extendable router interface.
