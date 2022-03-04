import { Router } from 'express';
import { getCategories, postCategories } from '../controllers/categoriesController.js';
import { validaSchemaMiddleware } from '../middlewares/validaSchemaMiddleware.js';
import categoriesSchema from '../schemas/categoriesSchema.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories',validaSchemaMiddleware(categoriesSchema), postCategories);

export default categoriesRouter;