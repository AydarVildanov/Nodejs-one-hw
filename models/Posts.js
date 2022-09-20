const {Schema, model} = require('mongoose')

const Posts = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, default: "None"}
})

module.exports = model('Posts', Posts)