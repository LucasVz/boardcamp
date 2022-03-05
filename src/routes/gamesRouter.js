import { Router } from 'express';
import { getGames, postGames } from '../controllers/gamesController.js';
import { validaSchemaMiddleware } from '../middlewares/validaSchemaMiddleware.js';
import gamesSchema from '../schemas/gamesSchema.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games',validaSchemaMiddleware(gamesSchema), postGames);

export default gamesRouter;