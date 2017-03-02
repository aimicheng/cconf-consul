const cconf = require('cconf');
const consul = require('consul');

var conf = {}, _inited = false, EF = function() {};

module.exports = function(options, callback) {
    var root_key = options.rootkey;
    var onError = options.onError ? options.onError : EF;
    var consul_client = consul(options.consul);
    var watch = consul_client.watch({
        method: consul_client.kv.get,
        options: {
            key: root_key,
            recurse: true
        }
    });

    function process(results) {
        for (var i in results) {
            var item = results[i],
                name = item.Key.replace(root_key, ''),
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
            callback(null, conf);
        }
    }

    watch.on('change', function(data, res) {
        process(data);
    });

    watch.on('error', onError);
};