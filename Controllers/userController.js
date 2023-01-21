const userModel = require("../Models/userModel");
const brcypt = require("bcrypt");

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // check if username exist
        const usernameCheck = await userModel.findOne({ username: username })
        if (usernameCheck) {
            return res.json({ message: "Username already exist", status: false })
        }
        // check if email exist
        const emailCheck = await userModel.findOne({ email: email });
        if (emailCheck) {
            return res.json({ message: "Email already exist", staus: false })
        }
        //  hash password
        const hashedPassword = await brcypt.hash(password, 10);

        const user = await userModel.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error)
    }
};

const registerUser = async (req, res) => {
    const { email, username, password } = req.body;
    let userData = new userModel(/* {
        email,
        username,
        password
    } */ req.body)
    try {
        // check if username or email already exist...
        const userCheck = await userModel.findOne({ $or: [{ email: email }, { username: username }] });

        if (userCheck) {
            if (userCheck.username === username && userCheck.email === email) {
                console.log("first")
                return res.json({ message: "User Already exists", status: false })
            } else if (userCheck.username === username) {
                console.log("second")
                return res.json({ message: "Username Already exists", status: false })
            } else if (userCheck.email === email) {
                console.log("third")
                return res.json({ message: "Email Already exists", status: false })
            }
        } else {
            // SAVE USER DATA
            // const userData = await userModel.create({
            //     email,
            //     username,
            //     password
            // });
            await userData.save();
            return res.json({ message: "Registration succesfull!!", status: true });
        }
    } catch (err) {
        console.log(err)
        return res.json({ message: "Server error, try again", status: false })
    }
}


const login = async (req, res, next) => {
    const { username, password } = req.body

    try {
        // check usernname
        let user = await userModel.findOne({ username });
        if (!user) {
            return res.json({ message: "Invalid details!!", status: false });
        }

        // check password
        let isValid = await brcypt.compare(password, user.password);
        if (!isValid) {
            return res.json({ message: "Invalid details!!", status: false })
        }

        delete user.password;
        console.log(delete user.password, user.password)
        return res.json({
            status: true,
            user: {
                username: user.username,
                email: user.email,
                isAvatarImageSet: user.isAvatarImageSet,
                avatarImage: user.avatarImage,
                _id: user._id
            }
        });
    } catch (error) {
        next(error)
    }
}


// SET AVATAR
const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { image } = req.body;

        const userData = await userModel.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: image,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });

    } catch (ex) {
        next(ex)
    }
}


// get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({ _id: { $ne: req.params.id } }).select("-password");

        return res.status(200).json({ users, status: true });
    } catch (ex) {
        next(ex);
    }
}




module.exports = {
    registerUser,
    register,
    login,
    setAvatar,
    getAllUsers
}