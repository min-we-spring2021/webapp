const StatsD = require('statsd-client');

const client = new StatsD({
    host: 'localhost',
    port: 8125
});
module.exports = client;