const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nyumbuSchema = new Schema({
    chatid: {
        type: Number,
    },
    cha_id: {
        type: Number
    }
}, {strict: false, timestamps: true })

const model = mongoose.model('tempChats', nyumbuSchema)
module.exports = model