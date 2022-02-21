const router = require("express").Router();

const UserController = require("../controllers/UserController.js");
const {verifyRegister,verifyLogin} = require("../middleware/UserMiddlware.js");
const {protect} = require("../middleware/AuthMiddlware.js");


router.post("/register",verifyRegister,UserController.registerUser);
router.post("/login",verifyLogin,UserController.loginUser);
router.get("/profile/:id",protect,UserController.getProfile);

module.exports = router