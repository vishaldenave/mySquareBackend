import express from "express"
import UserController from "../controller/userController.js"
import Authorization from "../controller/Authorization.js"
const router = express.Router()
router.get("/getDetail",Authorization.authorization,UserController.getDetail)
router.get("/editDetail",Authorization.authorization,UserController.editDetail)
router.post("/changePassword",Authorization.authorization,UserController.changePassword)
router.get("/getMenu",Authorization.authorization,UserController.getMenu)
export default router