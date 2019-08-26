const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContestantSchema = new Schema({
    name: { type:String },
    profile: { type: String },
    imageUrl: { type: String },
    session: { type: Schema.Types.ObjectId, ref: 'Session'}

});

const Contestant = mongoose.model('Contestant', ContestantSchema);
module.exports = Contestant;
