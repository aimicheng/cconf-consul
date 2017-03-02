# cconf-consul - A Configuration Loader with consul support

This package extends `cconf` with consul support.

## Getting Started

```shell
$ npm install --save cconf-consul
```

## Overview
### Example

```js
var cconf = require('cconf-consul');
var env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

cconf({
    consul: {
        host: "127.0.0.1",
        port: 8500,
        secure: false
    },
    root_key: 'config/' + env + '/'
}, function(err, result) {
    if (err) throw err;
    console.log(cconf.get('app_name'));
});
```