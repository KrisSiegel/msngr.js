# Messaging patterns
So at this point you've hopefully come to the *right* side of thinking that messaging is the best pattern (**S**uperior  **A**bstraction **L**ayer comes to mind) when developing software. No? Okay well that's fine since there is no single way of writing software that is better than all others but let's talk some messaging patterns you can use with msngr.js in your server or client code.

## Separation of concerns
Some abstraction strategies lean to the 'black boxing' approach in which messaging can be quite handy. So let's look at an example of using messaging to save a user's preferences.

```javascript
// BusinessLogic.js
msngr("Preferences", "Save", "application/json")
    .on(function(preferences) {
        // Save these
        console.log(preferences);
    });
```
```javascript
// RestLayer.js
msngr("Preferences", "Save", "application/json")
    .emit(request.params.preferences, function () {
        console.log("Saved");
    });
```

In the example above we're saying when we receive a message with a topic of "Preferences", a category of "Save" and a dataType of "application/json" that we should act on it and "save" them (or in this case dump to console). The restful layer sends the preferences and once the on is finished executing it will execute the emit's callback letting it know it's done.

So a simple way of separating things. One can envision creating multiple versions of 'BusinessLogic.js' where one saves to a local storage mechanism (memory perhaps?), another to MySQL, etc. This allows you to swap out backends depending on environment.

But this is too simple; msngr is *way* cooler than this!

## A better separation
Let's take a look at a more complex example.

```javascript
// Server.js
// Boilerplate server code here
msngr("Server", "Ready").persist();
```
```javascript
// RestfulEndpoints.js
msngr("Server", "Ready").on(function () {
    // Server is ready; setup restful endpoints
    router.get("/Users/", function (req, res) {
        msngr("Users", "List").emit(function (result) {
            res.json(result);
        });
    });
});
```
```javascript
// MySQLBackend.js
msngr("Server", "Ready").on(function () {
    // Server is ready; setup backend message handlers
    msngr("Users", "List").on(function (payload, async) {
        var done = async();
        // async call to MySQL for relevant data
        done(results);
    });
});
```
```javascript
// MemoryBackend.js
msngr("Server", "Ready").on(function () {
    var users = { };
    // Server is ready; setup backend message handlers
    msngr("Users", "List").on(function (payload) {
        return users;
    });
});
```
In the above example there are a several things to take note of. First the usage of ```persist()``` can persist a specific payload or just a message itself. By using persist in this way it doesn't matter what order the scripts run because they will all get the ready event from the server to let them setup themselves.

After that, using an environment configuration, you can choose to load ```MySQLBackend.js``` or ```MemoryBackend.js```. Both use the exact same messaging handlers, one works asynchronously and the other synchronously but the receiving end (the callback specified in emit) gets the data in the same way regardless.

Neat, right?
