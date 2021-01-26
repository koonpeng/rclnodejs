# rclnodejs - ROS2 Client Library for JavaScript [![npm](https://img.shields.io/npm/v/rclnodejs.svg)](https://www.npmjs.com/package/rclnodejs)[![Coverage Status](https://coveralls.io/repos/github/RobotWebTools/rclnodejs/badge.svg?branch=develop)](https://coveralls.io/github/RobotWebTools/rclnodejs?branch=develop)[![npm](https://img.shields.io/npm/dm/rclnodejs)](https://www.npmjs.com/package/rclnodejs)[![GitHub license](https://img.shields.io/github/license/RobotWebTools/rclnodejs.svg)](https://github.com/RobotWebTools/rclnodejs/blob/develop/LICENSE)[![node](https://img.shields.io/node/v/rclnodejs.svg)](https://nodejs.org/en/download/releases/)[![dependencies Status](https://david-dm.org/RobotWebTools/rclnodejs/status.svg)](https://david-dm.org/RobotWebTools/rclnodejs)[![npm type definitions](https://img.shields.io/npm/types/rclnodejs)](https://www.npmjs.com/package/rclnodejs)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

| Branch  |                                                            Linux Build                                                             |                                                                       macOS Build                                                                       |                                                                                Windows Build                                                                                |
| ------- | :--------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| develop | [![Build Status](https://travis-ci.org/RobotWebTools/rclnodejs.svg?branch=develop)](https://travis-ci.org/RobotWebTools/rclnodejs) | [![macOS Build Status](https://circleci.com/gh/RobotWebTools/rclnodejs/tree/develop.svg?style=shield)](https://circleci.com/gh/RobotWebTools/rclnodejs) | [![Build status](https://ci.appveyor.com/api/projects/status/upbc7tavdag1aa5e/branch/develop?svg=true)](https://ci.appveyor.com/project/minggangw/rclnodejs/branch/develop) |
| master  | [![Build Status](https://travis-ci.org/RobotWebTools/rclnodejs.svg?branch=master)](https://travis-ci.org/RobotWebTools/rclnodejs)  | [![macOS Build Status](https://circleci.com/gh/RobotWebTools/rclnodejs/tree/master.svg?style=shield)](https://circleci.com/gh/RobotWebTools/rclnodejs)  |  [![Build status](https://ci.appveyor.com/api/projects/status/upbc7tavdag1aa5e/branch/master?svg=true)](https://ci.appveyor.com/project/minggangw/rclnodejs/branch/master)  |

**rclnodejs** is a Node.js client library for the Robot Operating System
([ROS 2](https://index.ros.org/doc/ros2/)). It provides a JavaScript API
and tooling for ROS 2 programming. TypeScript declarations, i.e., (\*.d.ts),
are included to support use in TypeScript projects.

Here's an example for how to create a ROS 2 node that publishes a string message in a few lines of JavaScript.

```JavaScript
const rclnodejs = require('rclnodejs');
rclnodejs.init().then(() => {
  const node = new rclnodejs.Node('publisher_example_node');
  const publisher = node.createPublisher('std_msgs/msg/String', 'topic');
  publisher.publish(`Hello ROS 2 from rclnodejs`);
  node.spin();
});
```

## Documentation

- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Using TypeScript](#using-typescript)
- [Examples](https://github.com/RobotWebTools/rclnodejs/tree/develop/example)
- [FAQ and Known Issues](./docs/FAQ.md)
- [Building from Scratch](./docs/BUILDING.md)
- [Contributing](./docs/CONTRIBUTING.md)

## Installation

### Prerequisites

Before installing `rclnodejs` please ensure the following softare is installed and configured on your systemd:

- [Nodejs](https://nodejs.org/en/) version between 8.12 - 12.x.

- [ROS 2 SDK](https://index.ros.org/doc/ros2/Installation/) for details.
  **DON'T FORGET TO [SOURCE THE ROS 2 SETUP FILE](https://index.ros.org/doc/ros2/Tutorials/Configuring-ROS2-Environment/#source-the-setup-files)**

### Installing rclnodejs

Install the rclnodejs version that is compatible with your version of ROS 2 (see table below).

For the most current version of rclnodejs run:

```bash
npm i rclnodejs
```

To install a specific version of rclnodejs use:

```bash
npm i rclnodejs@x.y.z
```

|                                                            RCLNODEJS Version                                                            |                                                                         Compatible ROS 2 Release                                                                         |
| :-------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [0.18.0 (current)](https://www.npmjs.com/package/rclnodejs/v/0.18.0) ([API](http://robotwebtools.org/rclnodejs/docs/0.18.0/index.html)) | [Foxy Fitzroy](https://github.com/ros2/ros2/releases/tag/release-foxy-20201211) / [Eloquent Elusor](https://github.com/ros2/ros2/releases/tag/release-eloquent-20200124) |
|                                [0.10.3](https://github.com/RobotWebTools/rclnodejs/releases/tag/0.10.3)                                 |                                    [Dashing Diademata - Patch 4](https://github.com/ros2/ros2/releases/tag/release-dashing-20191018)                                     |

- **Note:** to install rclnodejs from GitHub: add `"rclnodejs":"RobotWebTools/rclnodejs#<branch>"` to your `package.json` depdendency section.

## Experimental Message Bindings

In order to use the new bindings, you must either:

set RCLNODEJS_USE_ROSIDL=1 environment variable.
or
add a `.npmrc` file in your project directory with `rclnodejs_use_rosidl=true`.

The new experimental message bindings uses ros interfaces to perform serialization. The main advantage of the new bindings is better performance, it is ~25% faster for large messages (1mb) and ~800% faster for small messages (1kb). It is also safer as memory is managed by v8, you will no longer get undefined behaviors when you try to reference a message outside the subscription callbacks. Also as a result of moving to v8 managed memory, it fixes some memory leaks observed in the current bindings.

The downside is that the new bindings is not API compatible, it does a number of things differently.

1. The new bindings initialize nested message as plain js objects instead of the wrappers classes. As a result, they don't contain wrapper methods, for example, this wouldn't work

```js
const msg = new UInt8MultiArray();
console.log(msg.hasMember('foo')); // ok, `msg` is a UInt8MultiArrayWrapper
console.log(msg.layout.hasMember('bar')); // error, `layout` is a plain js object, there is no `hasMember` method
```

2. There is no array wrappers.

```js
const UInt8MultiArray = rclnodejs.require('std_msgs').msg.UInt8MultiArray;
const Byte = rclnodejs.require('std_msgs').msg.Byte;
const byteArray = new Byte.ArrayType(10); // error, there is no `ArrayType`
```

3. Primitives are initialized to their zero value.

```js
const Header = rclnodejs.require('std_msgs').msg.Header;
let header = new Header();
console.log(typeof header.frame_id); // 'string', in the old bindings this would be 'undefined'
```

4. Shortform for `std_msg` wrappers are not supported.

```js
const String = rclnodejs.require('std_msgs').msg.String;
const publisher = node.createPublisher(String, 'topic');
publisher.publish({ data: 'hello' }); // ok
publisher.publish('hello'); // error, shortform not supported
```

5. Primitive arrays are always deserialized to typed arrays.

```js
const subscription = node.createSubscription(
  'std_msgs/msg/UInt8MultiArray',
  'topic',
  (msg) => {
    console.log(msg.data instanceof Uint8Array); // always true, even if typed array is disabled in rclnodejs initialization
  }
);
```

6. No conversion is done until serialization time.

```js
const UInt8MultiArray = rclnodejs.require('std_msgs').msg.UInt8MultiArray;
const msg = new UInt8MultiArray();
msg.data = [1, 2, 3];
console.log(msg.data instanceof Uint8Array); // false, assigning `msg.data` does not automatically convert it to typed array.
```

7. Does not throw on wrong types, they are silently converted to their zero value instead.

```js
const String = rclnodejs.require('std_msgs').msg.String;
const publisher = node.createPublisher(String, 'topic');
publish.publish({ data: 123 }); // does not throw, data is silently converted to an empty string.
```

8. Message memory is managed by v8. There is no longer any need to manually destroy messages and
   do other house keeping.

```js
// With the old bindings, this may result in use-after-free as messages may be deleted when they
// leave the callback, even if there are still references to it. You will have to deep copy the message
// and manually destroy it with its `destroy` method when you don't need it anymore.
//
// This is safe with the new bindings, `lastMessage` will either be `undefined` or the last message received.
// Old messages are automatically garbage collected by v8 as they are no longer reachable.
let lastMessage;
const subscription = node.createSubscription(
  'std_msgs/msg/UInt8MultiArray',
  'topic',
  (msg) => {
    lastMessage = msg;
  }
);
setTimeout(() => {
  console.log(lastMessage);
}, 1000);
```

## API Documentation

API documentation is generated by `jsdoc` and can be viewed in the `docs/` folder or [on-line](http://robotwebtools.org/rclnodejs/docs/index.html). To create a local copy of the documentation run `npm run docs`.

## Using rclnodejs with TypeScript

`rclnodejs` API can be used in TypeScript projects. You can find the TypeScript declaration files (\*.d.ts) in the `types/` folder.

Your `tsconfig.json` file should include the following compiler options:

```jsonc
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es6"
    // your additional options here
  }
}
```

Here's a short `rclnodejs` TypeScript example:

```typescript
import * as rclnodejs from 'rclnodejs';
rclnodejs.init().then(() => {
  const node = new rclnodejs.Node('publisher_example_node');
  const publisher = node.createPublisher('std_msgs/msg/String', 'topic');
  publisher.publish(`Hello ROS 2 from rclnodejs`);
  node.spin();
});
```

The benefits of using TypeScript become evident when working with more complex use-cases. ROS messages are defined in the `types/interfaces.d.ts` module. This module is updated as part of the `generate-messages` process described in the next section.

## ROS2 Interface Message Generation (important)

ROS components communicate by sending and receiving messages described
by the interface definition language (IDL). ROS client libraries such as
rclnodejs are responsible for converting these IDL message descriptions
into source code of their target language. For this, rclnodejs provides
the `generate-messages` npm script that reads in the IDL
messages files of a ROS environment and generates corresponding JavaScript
message interface files. Additionally, the tool generates the TypeScript
`interface.d.ts` file containing declarations for every IDL message file
processed.

Learn more about ROS interfaces and IDL [here](https://index.ros.org/doc/ros2/Concepts/About-ROS-Interfaces/).

In the following example rclnodejs loads a generated JavaScript message file corresponding to the ROS `std_msgs/msg/String' definition.

```
import * as rclnodejs from 'rclnodejs';
let stringMsgObject = rclnodejs.createMessageObject('std_msgs/msg/String');
stringMsgObject.data = 'hello world';
```

### Maintaining Generated JavaScript Message Files

Message files are generated as a post-install step of the rclnodejs
installation process. Thereafter, you will need to manually run the
message generation script when new ROS message packages are installed
for which your ROS2-nodejs project has a dependency.

### Running `generate-messages` Utility

To use `generate-messages` from your Nodejs package, create an npm
script entry in your package.json file as shown:

```
"scripts": {
  "generate-messages": "generate-messages"
  // your other scripts here
}
```

To run the script use `npm` as follows:

```
npm run generate-messages
```

The newly generated JavaScript files can be found at
`<yourproject>/node_modules/rclnodejs/generated/`.

## Contributing

Please read the [Contributing Guide]() before making a pull request.

Thank you to all the [people](CONTRIBUTORS.md) who already contributed to rclnodejs!

<div>
<a href="https://github.com/wayneparrott">
  <img src="https://github.com/wayneparrott.png" width="30">
</a>
<a href="https://github.com/koonpeng">
  <img src="https://github.com/koonpeng.png" width="30">
</a>
<a href="https://github.com/mattrichard">
  <img src="https://github.com/mattrichard.png" width="30">
</a>
<a href="https://github.com/felixdivo">
  <img src="https://github.com/felixdivo.png" width="30">
</a>
<a href="https://github.com/martins-mozeiko">
  <img src="https://github.com/martins-mozeiko.png" width="30">
</a>
<a href="https://github.com/amikhalev">
  <img src="https://github.com/amikhalev.png" width="30">
</a>
<a href="https://github.com/kenny-y">
  <img src="https://github.com/kenny-y.png" width="30">
</a>
<a href="https://github.com/qiuzhong">
  <img src="https://github.com/qiuzhong.png" width="30">
</a>
<a href="https://github.com/minggangw">
  <img src="https://github.com/minggangw.png" width="30">
</a>
<a href="https://github.com/hanyia">
  <img src="https://github.com/hanyia.png" width="30">
</a>
</div>

## License

This project abides by the [Apache License 2.0](https://github.com/RobotWebTools/rclnodejs/blob/develop/LICENSE).
