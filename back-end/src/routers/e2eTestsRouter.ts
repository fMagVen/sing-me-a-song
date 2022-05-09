import { Router } from 'express'
import * as e2eTestsController from '../controllers/e2eTestsController.js'

const testRouter = Router();

testRouter.post('/truncate', e2eTestsController.truncate);

export default testRouter;