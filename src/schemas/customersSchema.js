import joi from 'joi';


const customersSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().regex(/^[0-9]{10,11}$/),
  birthday: joi.string(),
  cpf: joi.string().regex(/^[0-9]{11}$/)
});

export default customersSchema;
