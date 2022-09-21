const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nyumbuSchema = new Schema({
    chatid: {
        type: Number,
    },
    username: {
        type: String
    }
}, {strict: false, timestamps: true })

const model = mongoose.model('nyumbuModel', nyumbuSchema)
module.exports = model