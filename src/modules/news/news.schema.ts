import * as mongoose from 'mongoose'

export const NewsSchema = new mongoose.Schema({
    newsId: mongoose.Schema.Types.ObjectId,
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