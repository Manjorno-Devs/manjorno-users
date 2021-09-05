import bcrypt from 'bcrypt';

import User from "../db/user.js";

class UserService{

    constructor(){}

    static RegisterUser = async (username, clearPassword, email, profilePictureFileName) => {
        const salt = await bcrypt.genSalt(12);
        const password = await bcrypt.hash(clearPassword, salt);
        const newUser = new User({username, password, email, profilePictureFileName});
        await newUser.save();
    };

    static FindUserByUsername = async (username) => {
        return await User.findOne({username});
    };

    static FindUserByEmail = async (email) => {
        return await User.findOne({email});
    }

    static FindUserById = async (id) => {
        return await User.findById(id);
    }

    static EditUser = async (_id, username, clearPassword, email, accountType, profilePictureFileName) => {
        const salt = await bcrypt.genSalt(12);
        const password = await bcrypt.hash(clearPassword, salt);
        return await User.updateOne(_id, {username, password, email, accountType, profilePictureFileName});
    }

    static DeleteUser = async (_id) => {
        return await User.deleteOne({_id});
    }
};

export default UserService; 
