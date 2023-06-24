import { Router } from "express";
import problem_router from "./problem";

const router = Router();

// 라우팅 설정
// http://localhost:3000/problem
router.get("/", (req, res) => {
    res.redirect("/problem");
});
router.use("/problem", problem_router);

export default router;