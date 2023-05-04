const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supatipSchema = new Schema({
    time: {
        type: String,
    },
    siku: {
        type: String
    },
    league: {
        type: String
    },
    match: {
        type: String
    },
    league: {
        type: String
    },
    tip: {
        type: String,
    },
    nano: {
        type: String,
    },
    matokeo: {
        type: String,
        default: '-:-'
    },
    status: {
        type: String,
        default: 'pending'
    }
}, {strict: false, timestamps: true })

const ya_uhakika = mongoose.connection.useDb('mikeka-ya-uhakika')
let model = ya_uhakika.model('fametips', supatipSchema)
module.exports = model