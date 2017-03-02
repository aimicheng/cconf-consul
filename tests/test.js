var cconf = require('../index');

cconf({
    consul: {
        host: "127.0.0.1",
        port: 8500,
        secure: false
    },
    root_key: 'common/'
}, function(err, result) {
    if (err) throw err;
    console.log(result);
});