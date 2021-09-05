import User from "../db/user.js";

class UserService{

    static RegisterUser = async (username, password, email, profilePictureFileName) => {
        const newUser = new User({username, password, email, profilePictureFileName});
        await newUser.save();
    };

    static FindUserByUsername = async (username) => {
        return await User.findOne({username});
    };

    static FindUserByEmail = async (email) => {
        return await User.findOne({email});
    }
};

export default UserService; 
