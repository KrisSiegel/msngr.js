#msngr.js API
This document outlines the exposed msngr.js API. It does not cover anything internal that isn't expected to be used by typical developers.

## ```msngr(topic, category, dataType)```
```topic (required)``` - a string to signify the topic of the message.

```category (optional)``` - a string to signify the category of the message.

```dataType (optional)``` - a string to signify the dataType of the message.

```returns``` a msngr object

```javascript
var msg = msngr("MyTopic", "MyCategory", "MyDataType");
```

## ```msngr object```
The methods below are part of a ```msngr``` object returned from the ```msngr()``` method.

### ```.emit(payload, callback)```
```payload (optional)``` - the payload to send to a receiver.

```callback (optional)``` - the callback to execute when all handlers finish executing. Provides a result object as a first parameter to the callback with an aggregation of all synchronously or asynchronously returned data. The ```payload``` parameter can be omitted while just a ```callback``` is passed into ```.emit()```.

```javascript
var msg = msngr("MyTopic");
msg.emit(function (result) {
    console.log(result);
});
```

### ```.on(callback)```
```callback (required)``` - registers a method to handle the previously supplied message. The value returned is then sent to the emit callback. If a return value needs to be asynchronous then the second parameter supplied to the callback can be used.

```javascript
var msg = msngr("MyTopic");
msg.on(function (payload, async) {
    var done = async();
    done("Somevalue");
});
msg.emit(function (result) {
    console.log(result); // Prints ["Somevalue"]
});
```

### ```.once(callback)```
```callback (required)``` - registers a method to handle the previously supplied message. The value returned is then sent to the emit callback. If a return value needs to be asynchronous then the second parameter supplied to the callback can be used.
