let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let UserSchema = Schema({
    nom: String,
    type: String,
    photoUrl: String
},
    {
        versionKey: false
    });

UserSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('users', UserSchema);