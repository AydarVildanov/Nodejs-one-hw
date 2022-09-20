const {Schema, model} = require('mongoose')

const Token = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    token: {type: String, required: true},
})

module.exports = model('Token', Token)