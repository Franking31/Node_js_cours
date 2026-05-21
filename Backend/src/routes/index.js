import { Router } from "express";
import authRouter from './auth.routes.js';
import quizRouter from './quiz.routes.js';
import adminRouter from './admin.routes.js';

const router = Router();

router.get('/',(req, res, next)=>{
    res.json({
        message:'quiz api est lance ...'
    })
});

router.use('/auth',authRouter );
router.use('/quiz',quizRouter);
router.use('/admin', adminRouter);

export default router;