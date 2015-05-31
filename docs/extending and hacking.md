# Extending and hacking
A big part of my development background has been dealing with other people's libraries. Sometimes they're great and sometimes they're not. Regardless of how great (or not great) they are I've been in multiple situations where I need to make a critical change and it's difficult or impossible to do without modifying the original source (which is sometimes hosted on a CDN that can't change).

With this in mind I tried to make msngr.js approachable to extend or hack. Hopefully I did a good enough job :)

## Two ways of extending / enhancing
There are two ways of extending msngr.js depending on what you want to do and they both use the same msngr.extend() method.

### Extending top level methods of msngr.js
The msngr.extend() method allows you to specify an object to mix with msngr. This is pretty straight forward and a basic way to get new methods into the top level of the msngr object.

```javascript
msngr.extend({
    sayHello: function () {
        console.log("Hello, msngr.js!");
    }
});

msngr.sayHello(); // Prints "Hello, msngr.js!"
```

### Adding options
You can also supply a method which is provided the external and internal interfaces of msngr as arguments then takes the result and mixes it with the msngr object. This is how you can add additional options to msngr to use on a message object. Note that this is pretty raw as it exposes you to the internal interface of msngr.

```javascript
msngr.extend(function (external, internal) {
    internal.options["my option"] = function (message, payload, options, async) {
        var config = options["my option"];
        var done = async();
        // Do something here
        done("My Result");
    };

    return { }; // Optionally return an object that gets mixed with the msngr object
});

var msg = msngr("MyTopic");
msg.option("my option", { configurationValue: true });
msg.on(function (payload) {
    console.log(payload); // Prints "My Result";
});
msg.emit();
```

So first we passed in a method to msngr.extend(). This automatically gives us access to two parameters: ```external``` and ```internal```.

```external``` provides access to all top level msngr methods without requiring the name 'msngr' should it later need to be changed due to the environment (such as multiple versions of msngr).

```internal``` is a raw object with a set of objects, methods, properties and other items that are internally accessible to all msngr components. Here we add our new option method to an options object where, upon each execution, we receive a message, the payload, an optional configuration object (which includes configurations for *all* options to be executed for this message, not just your option) and an async method that allows a return value to be returned asynchronously.

So what happens when your option returns a value? This value is taken and merged with the payload that is already being sent to the handler. So take caution that you're not doing anything funny with the payload.

## Okay so what about 'hacking'?
So if you look at the ways of extending msngr.js you will notice that you can access the internal interface really easily. This lets you do *anything* to msngr.js.

So let's say you want have the memory indexer that msngr uses to index messages and you want to replace it. You could change code and submit a pull request but let's say you find an issue you need to fix NOW and you're in an environment where msngr is already approved and you can't change its code. What do you do!?

It's actually kinda easy :)


```javascript
msngr.extend(function (external, internal) {
    internal.objects.memory = function () {
        return {
            // API goes here
        };
    };
});
```

So the example isn't filled out but you just replaced the memory indexer with an empty JavaScript object. Obviously this will break msngr.js pretty badly but you could now write your own indexer and drop it in here.

You can do this with many other things in the internal interface, too. There is a message object that handles all messaging you could modify, extend or even replace.

Enjoy!
