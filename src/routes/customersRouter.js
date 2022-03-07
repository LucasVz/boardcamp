import { Router } from 'express';
import { validaSchemaMiddleware } from '../middlewares/validaSchemaMiddleware.js';
import { getCustomers , getCustomer , postCustomers, putCustomers } from '../controllers/customersController.js';
import customersSchema from '../schemas/customersSchema.js';
const clientsRouter = Router();

clientsRouter.get('/customers', getCustomers);
clientsRouter.get('/customers/:id', getCustomer)
clientsRouter.post('/customers', validaSchemaMiddleware(customersSchema), postCustomers);
clientsRouter.put('/customers/:id', validaSchemaMiddleware(customersSchema), putCustomers);

export default clientsRouter;