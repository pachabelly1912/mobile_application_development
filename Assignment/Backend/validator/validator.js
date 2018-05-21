var Joi = require('joi');
var expressJoi = require('express-joi');

const com = {
    body: {
        comId: Joi.string().required(),
        gpus: Joi.array().includes(Joi.object({
            gpuId: Joi.string(),
            defaultFieldValues: Joi.object({
                temp: Joi.number(),
                fan: Joi.number(),
                load: Joi.number(),
                mem: Joi.number()
            })
        })).required()
    }
};

exports.postComputer = expressJoi.joiValidate(com);
