import express from "express"
import AuthController from "../controller/AuthController.js"
const router = express.Router()
router.post("/register",AuthController.register)
router.post("/login",AuthController.login)
router.post("/forgotPassword",AuthController.forgotPassword)
router.post("/resetPassword/:id/:token",AuthController.resetPassword)
export default router
