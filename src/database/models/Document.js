const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const DocumentSchema = new Schema({
    inputs: {
        type: String,
        required: true
    },
    signature: {
        type: Boolean,
        default: false
    },
    template: {
        type: Schema.Types.ObjectId,
        ref: 'Template'
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

DocumentSchema.plugin(mongoosePaginate)

module.exports = model('Document', DocumentSchema)