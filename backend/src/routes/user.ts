import { Router } from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { getUser } from "../controllers/user.js";

const router = Router()

router.get('/', verifyToken, getUser)

export default router