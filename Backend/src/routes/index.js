import { Router } from "express";
import authRouter from './auth.routes.js';
import quizRouter from './quiz.routes.js';

const router = Router();

router.get('/',(req, res, next)=>{
    res.json({
        message:'quiz api est lance ...'
    })
});

router.use('/auth',authRouter );
router.use('/quiz',quizRouter);

router.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route introuvable : ${req.method} ${req.originalUrl}`,
    });
});

export default router;