const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String, 
        required: true,
        min: 8,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    }
});

// HASH PASSWORD...
const saltRound =  10;
userSchema.pre("save", function (next) {
    // console.log(this) 
    // try {
    //     const hashed = await bcrypt.hash(this.password, saltRound);
    //     this.password = hashed
    //     console.log(hashed)
    //     next()
    // } catch (err) {
    //     console.log(err)
    // }

    bcrypt.hash(this.password, saltRound, (err, hashed) => {
        if (err) {
            // console.log(err);
            next(err)
        } else {
            // console.log(hashed)
            this.password = hashed;
            next();
        }
    })

});

userSchema.methods.validatePassword = function (password, callBack) {
    console.log(password)

    bcrypt.compare(password, this.password, (err, isValid) => {
        if (!err) {
            callBack(err, isValid);
        } else {
            next();
        }
    })
}


const userModel = mongoose.model("users_collection", userSchema)

module.exports = userModel;