const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }
})

accountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Account", accountSchema);