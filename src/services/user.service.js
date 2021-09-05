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

    static FindUserById = async (id) => {
        return await User.findById(id);
    }

    static EditUser = async (_id, username, password, email, profilePictureFileName) => {
        return await User.updateOne(_id, {username, password, email, profilePictureFileName});
    }

    static DeleteUser = async (_id) => {
        return await User.deleteOne({_id});
    }
};

export default UserService; 
