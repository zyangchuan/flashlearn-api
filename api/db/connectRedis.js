const Redis = require("ioredis");
const client = new Redis(6379, 'redis');

module.exports = client;