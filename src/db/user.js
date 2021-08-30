import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profilePictureFileName: {
        type: String,
        default: 'default-profile.png'
    },
    accountType: {
        type: String,
        enum: ['Normal User', 'Restaurant Staff', 'Restaurant Owner', 'Restaurant Moderator', 'User Moderator', 'Admin'],
        default: 'Normal User'
    },
    registeredAt: {
        type: Date,
        default: new Date()
    }
});

const users = mongoose.model("Users", userSchema);

export default users;