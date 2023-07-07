const { Schema, model, models } = require('mongoose')
const { hashPassword, verifyPassword } = require('../../utils/common')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  rol: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
},
{
timestamps: true
})

UserSchema.pre("save", async function(next) {
  const user = this
  if(!this.isModified('password')) return next()
  const hashedPw = await hashPassword(10, user.password)
  user.password = hashedPw
  next()
})

UserSchema.path('username').validate(async function (value) {
  const user = await models.User.findOne({username: value });
  if(!user) return true
  return  user.equals(this._id)
}, 'El nombre de usuario ya existe');

UserSchema.methods.checkPassword = async function(password){
  const user = await this.model.findOne({username: this.username}).select('password')
  const isSamePass = await verifyPassword(password, user.password)
  return isSamePass
}

UserSchema.plugin(mongoosePaginate)

module.exports = model('User', UserSchema)