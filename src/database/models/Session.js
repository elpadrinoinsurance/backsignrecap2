const {Schema, model} = require('mongoose')

const SessionSchema = new Schema({
    session: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, 
{
    timestamps: true
},
{
    timestamps: true
})

module.exports = model('Session', SessionSchema)