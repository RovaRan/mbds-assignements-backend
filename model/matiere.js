let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const user = require('./user');

let MatiereSchema = Schema({
    nom: String,    
    prof:{ type: Schema.Types.ObjectId, ref: user },
    etudiants:[{type:Schema.Types.ObjectId, ref: user}]
},
{
    versionKey: false
});

MatiereSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('matieres', MatiereSchema);
