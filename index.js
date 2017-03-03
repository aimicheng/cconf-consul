const cconf = require('cconf');
const consul = require('consul');

var conf = {}, _inited = false, EF = function() {};

module.exports = function(options, callback) {
    var rootKey = options.rootKey,
        onError = options.onError ? options.onError : EF,
        consul_client,
        watcher;

    if (!rootKey) {
        throw new Error('rootKey must presents.');
    }
    if (rootKey.startsWith('/')) {
        throw new Error("rootKey can not start with '/'.");
    }
    if (!rootKey.endsWith('/')) {
        throw new Error("rootKey must end with '/'.");
    }
    if (typeof onError !== 'function') {
        throw new Error('onError must be a function.');
    }

    consul_client = consul(options.consul);
    watcher = consul_client.watch({
        method: consul_client.kv.get,
        options: {
            key: rootKey,
            recurse: true
        }
    });

    function process(results) {
        for (var i in results) {
            var item = results[i],
                name = item.Key.replace(rootKey, ''),
                value = item.Value;
            if (name === '') {
                continue;
            }
            if (name.endsWith('/')) {
                continue;
            }
            //JSON format
            if (value && item.Flags === 1) {
                value = JSON.parse(value);
            }

            var parts = name.split('/'),
                o = conf;
            for (var i in parts) {
                var part = parts[i];
                if (i < (parts.length - 1)) {
                    if (!o[part])
                        o[part] = {};
                    o = o[part];
                } else {
                    o[part] = value;
                }
            }
        }

        cconf.merge(conf);
        if (!_inited) {
            _inited = true;
            callback(null, cconf);
        }
    }

    watcher.on('change', function(data, res) {
        process(data);
    });

    watcher.on('error', onError);
};