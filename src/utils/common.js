const { HttpStatusError } = require("../Errors/http-status-error")
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const { ERROR_TYPES } = require('../Errors/constants');

const isJSON = (objStringified) => {
    try{
        const obj = JSON.parse(objStringified)
        return true
    }
    catch(err){
        return false
    }
}

const controllerWrapper = (fn) => {
    return async (req, res, next) => {
        try{
            await fn(req, res, next)
        } catch(err) {
            next(err)
        }
    }
}

const toObjectID = (id) => {
    try{
        if(typeof id === 'string') return mongoose.Types.ObjectId(id)
        return id
    }
    catch(err){
        throw HttpStatusError.badRequest({ message: "El id recibido no es valido", type: ERROR_TYPES.ERROR})
    }
}

const mapObject = (obj, cb) => {
    const objKeys = Object.keys(obj)
    return objKeys.map(cb)
}

const ModelFindById = async (Model, id, options = {filter: {}, select: {}}) => {
    const objectId = toObjectID(id)
    const {filter, select} = options
    const result = await Model.findOne({_id: objectId, ...filter}).select(select)
    if(!result) throw HttpStatusError.notFound({message: `${Model.modelName} not found`})
    return result
}

const ModelCount = async (Model, field, value) => {
    const count = await Model.count({[field]: value})
    return count
}

const ModelUpdateById = async (Model, id, updateData, options) => {
    const {filter, select, selectFull} = options
    const updateOps =  {filter, select}
    if(selectFull){
        const columns = Object.keys(Model.schema.paths)
        updateOps.select = columns.join(" ")
    }
    const register = await ModelFindById(Model, id, options)
    Object.keys(updateData).forEach(data => {
        register[data] = updateData[data]
    })
    await register.save()
    return register
}

const ModelFind = async (Model, field, value) => {
    const result = await Model.find({[field]: value})
    return result
}

const hashPassword = async (saltRounds = 10, password) => {
  return await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) reject(err);
          resolve(hash)
      });
  });
};

const verifyPassword = async (password, hash) => {
    const isSame = await bcrypt.compare(password, hash)
    return isSame
}

module.exports = {
    isJSON,
    controllerWrapper,
    toObjectID,
    mapObject,
    ModelFindById,
    ModelCount,
    ModelFind,
    hashPassword,
    verifyPassword,
    ModelUpdateById
}