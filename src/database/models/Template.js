const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const TemplateSchema = new Schema({
    schemas: {
        type: String,
        required: true
    },
    sampledata: {
        type: String,
        required: true
    },
    columns: {
        type: String,
        required: true
    },
    base: {
        type: Schema.Types.ObjectId,
        ref: 'Base'
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

TemplateSchema.plugin(mongoosePaginate)

module.exports = model('Template', TemplateSchema)