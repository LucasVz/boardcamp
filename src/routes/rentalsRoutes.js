import { Router } from 'express';
import { validaSchemaMiddleware } from '../middlewares/validaSchemaMiddleware.js';
import { getRentals, postRentals, deleteRentals, returnRentals } from '../controllers/rentalsController.js';
import rentalsSchema from '../schemas/rentalsSchema.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals',validaSchemaMiddleware(rentalsSchema), postRentals);
rentalsRouter.post('/rentals/:id/return', returnRentals);
rentalsRouter.delete('/rentals/:id',deleteRentals);
export default rentalsRouter;