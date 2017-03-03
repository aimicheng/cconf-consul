var cconf = require('../index');

cconf({
    consul: {
        host: "10.16.3.240",
        port: 8500,
        secure: false
    },
    rootKey: 'plf/dev/common/'
}, function(err, cconf) {
    if (err) throw err;
    console.log(cconf.get('redis'));
});