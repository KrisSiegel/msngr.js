![msngr.js](https://github.com/KrisSiegel/msngr.js/raw/5.0.0/resources/logo.png "msngr.js logo")

Messaging creates a powerful development pattern that makes decoupling components and providing internal APIs incredibly easy. The primary goal in msngr is to provide a high quality, asynchronous method of consuming and emitting messages that work in both node and the web browser.

There is a secondary goal in providing great, universal objects and functions that are useful in essentially every application. This includes type validation using ```msngr.is(obj)```, standard HTTP calling with ```msngr.net(url)``` and a merge cache that includes transactions in ```msngr.mache()```.

### Snag a copy of msngr
Install via npm or bower by running ```npm install msngr``` or ```bower install msngr```

Reference msngr.js directly from cdnjs by heading to the following page, picking your version and grab the URL https://cdnjs.com/libraries/msngr

Grab the ```msngr.js``` or ```msngr.min.js``` files directly from this repo!

### Hello, World!
```javascript
msngr("SayIt").on(function (words) {
    console.log(words); // Outputs 'Hello, World!'
});

msngr("SayIt").emit("Hello, World!");
```

### Anatomy of a message
Messages can be comprised of a topic, category and subcategory with topic being the only required piece all of which are specified in the main msngr function ```msngr(topic, category, subcategory)```. This allows for a large range of message consumption from the very general to the highly specific.

### Consuming and emitting
When consuming or emitting a message you can choose to match just the topic, the topic and category or the topic, category and subcategory. This allows for a greater range of control and the handlers consuming a message always have access to the incoming message. This allows you to do something like the following example.

```javascript
msngr("Profile", "Save", "application/json").on(function (payload) {
    console.log("Saving code here");
});

msngr("Profile", "Save", "application/json").
```
