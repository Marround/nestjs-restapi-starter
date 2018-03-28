import * as mongoose from 'mongoose'

export const BlogSchema = new mongoose.Schema({
    blogId: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    link_str: String,
    anons: String,
    description: String,
    created: {
        type: Date,
        default: Date.now()
    }
});