import mongoose, { Schema, model } from "mongoose";

mongoose.connect("mongodb://localhost:27017/brainly")
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})
                                         
const contentTypes = ['image', 'video', 'article', 'audio'];
const ContentSchema = new Schema({
    title: String,
    link: String,
    type: { type: String, enum: contentTypes },
    tags: [{
        title: {
            type: String,
            required: true
        }
    }],
    userId: { type: ObjectId, ref: 'User', required: true }
})

const LinkSchema = new Schema({
    hash: String,
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
})


export const User = model("User", UserSchema)
export const Content = model('Content', ContentSchema)
export const Link = model('Link',LinkSchema) ;

