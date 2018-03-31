import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    displayName: {type: String, required: true, unique: true},
    isUser: {type: Boolean, default: true},
    isAdmin: {type: Boolean, default: false},
    isModerator: {type: Boolean, default: false},
    isActive: {type: Boolean, default: false},
    regData: {type: Date, default: new Date()},
    lastLogin: Date
}, {
    toObject: {virtuals: true}
});