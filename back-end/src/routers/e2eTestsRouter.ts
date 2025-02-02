import { Router } from 'express'
import * as e2eTestsController from '../controllers/e2eTestsController.js'

const testRouter = Router();

testRouter.post('/truncate', e2eTestsController.truncate);
testRouter.post('/seed', e2eTestsController.seed)

export default testRouter;