const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const BaseSchema = new Schema({
    basePdf: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    madeBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, 
{
    timestamps: true
})

BaseSchema.plugin(mongoosePaginate)

module.exports = model('Base', BaseSchema)