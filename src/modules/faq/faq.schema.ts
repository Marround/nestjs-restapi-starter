import * as mongoose from 'mongoose'

export const FaqSchema = new mongoose.Schema({
    faqId: mongoose.Schema.Types.ObjectId,
    question: String,
    answer: String,
    visible: Boolean,
    description: String,
    link_str: String,
    created: {
        type: Date,
        default: Date.now()
    }
});