# Web browser niceties
While msngr.js has plenty of generic capability that can run under node.js and a web browser it includes a few nice features that only work in web browsers.

## Cross window communication
Have you ever used a web browser where you had multiple instances of a web application open? There are many use-cases where this may happen but what do you do if a change happens in window 1 then you look at window 2? You could setup a one-off call using postMessage or make your web app revolve around the data inside of localStorage and listen to its events. But that can be annoying especially if you didn't realize your users even want this until it's too late to make such structural changes.

With msngr.js you can use the same interfaces already available for messaging and send them across windows! Let's just jump into an example.

```javascript
// Window 1
var msg = msngr("Notifications", "Count");
msg.option("cross-window");
msg.on(function (payload) {
    var notificationElm = document.querySelector("#NotificationCount");
    notificationElm.innerHTML = payload;
});

msg.emit(5);
```

```javascript
// Window 2
var msg = msngr("Notifications", "Count");
msg.option("cross-window");
msg.on(function (payload) {
    var notificationElm = document.querySelector("#NotificationCount");
    notificationElm.innerHTML = payload;
});
```

Both windows use the same code and message to update a notification count. Window 1 decides its time to update the notification count to 5. Both windows will receive this value within these handlers. Neat, right?

## Binding messages to DOM elements
We can take a message and bind it directly to an element's event letting you keep your code separate from even dealing with an object's eventing directly.

```html
<input type="text" name="username" />
<button name="save">Save</button>
```

```javascript
var msg = msngr("User", "Save");
msg.bind("button[name=save]", "click");
msg.on(function (payload) {
    // The user clicked the payload button
});
```

So this lets you take a message, a message's handler and bind it directly to an element's event. This is helpful in keeping your code separate and you can even unit test by directly emitting to the same handler!

But you still have to get that username so your code still has to hit the dom thus ruining your true code separation of presentation and business logic. Right?

## The DOM option
Adding options to your messages allow you to take advantage of additional extensions within msngr.js. The 'dom' option allows the specifying of selectors which, upon being emitted, are used to gather and aggrevate values. Take a look at this example:

```html
<input type="text" name="username" />
<button name="save">Save</button>
```

```javascript
var msg = msngr("User", "Save");
msg.bind("button[name=save]", "click");
msg.option("dom", ["input[name=username]"]);
msg.on(function (payload) {
    console.log(payload.username); // The value in the username field
});
```

The 'dom' option takes an array of selectors which then grab a value and puts it in the payload either by the name of the element or it generates a property itself with a tag name. Pretty handy, right? Now you can write code that handles a click event on a form and have *ZERO* DOM code in the actual handler.
