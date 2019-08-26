const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    creator: { type: String },
    title: { type: String },
    hash: {type: String },
    contestants: [{
      contestant: { type: Schema.Types.ObjectId, ref: 'Contestant' },
      votes: { type: Number },
      profile: { type: String}
    }]
});

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;
