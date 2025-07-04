import express from 'express'
import { Router } from 'express'
import LeadsController from "../controllers/LeadsController.js"
import UserController from '../controllers/UserController.js'
import { authentication } from '../middlewares/Auth.js'

const router = Router()

//Routes start here
router
    .route('/leads')
    .get(authentication, LeadsController.getLead)
    .post(LeadsController.createLead);

router
    .route('/leads/:id')
    .patch(LeadsController.patchLeadStatus)
    .delete(LeadsController.deleteLeadStatus);

router.route('/register').post(UserController.register)
router.route('/login').post(UserController.login)

export default router