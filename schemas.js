const Joi = require('joi');
const { number } = require('joi');

module.exports.adminSchema = Joi.object({
   
        username : Joi.string().required(),
        password: Joi.string().required()

    
}).required();


module.exports.userSchema = Joi.object({

        username : Joi.string().required(),
        password: Joi.string().required()

  
}).required();


module.exports.courseSchema = Joi.object({

    title : Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()


}).required();