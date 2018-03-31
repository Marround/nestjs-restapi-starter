import * as mongoose from 'mongoose';

export const FilesSchema = new mongoose.Schema({
    fileId: mongoose.Schema.Types.ObjectId,
    path: {type: String, required: true, unique: false},
    name: {type: String, required: true, unique: false},
    alt: {type: String},
    description: {type: String}
}, {
    toObject: {virtuals: true}
});