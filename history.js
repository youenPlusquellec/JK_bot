
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const usersModel = require("./user.model");

const res = usersModel.getHistory(action)
res.then(result => {
    console.log(result)
})
