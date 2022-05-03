let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const user = require('./user');

let authenticationSchema = Schema({
    identifiant: String,
    motDePasse: String,
    derniereConnexion: Date,
    user: { type: Schema.Types.ObjectId, ref: user }
},
    {
        versionKey: false
    });

authenticationSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('authentication', authenticationSchema);