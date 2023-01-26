const { register, login, setAvatar, getAllUsers, registerUser, signinUser, getProfile } = require("../Controllers/userController");

const router = require("express").Router();


router.post("/register", registerUser);
router.post("/login", signinUser);
router.get("/profile", getProfile);
// router.post("/register", register);
// router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);

const messageRoutes = router;

module.exports = messageRoutes;