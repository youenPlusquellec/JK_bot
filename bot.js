const Client = require('./structures/Client');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const client = new Client();
client.login();

process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));