const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
});

User.plugin(passportLocalMongoose); // adds username and password fields to the schema by default using passoport-local-mongoose npm package

module.exports = mongoose.model("User", userSchema);