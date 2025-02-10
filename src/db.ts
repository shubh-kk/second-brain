import mongoose, { Schema, model } from "mongoose";

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/brainly")

// Define ObjectId type for MongoDB
const ObjectId = mongoose.Types.ObjectId;

// User schema definition
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})
                                         
// Content schema definition
const ContentSchema = new Schema({
    title: String,
    link: String,
    type: { type: String },
    tags: [{
        title: {
            type: String,
            required: true
        }
    }],
    userId: { type: ObjectId, ref: 'User', required: true }
})

// Link schema definition for shareable links
const LinkSchema = new Schema({
    hash: String,
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
})

// Export models for use in other parts of the application
export const User = model("User", UserSchema)
export const Content = model('Content', ContentSchema)
export const Link = model('Link',LinkSchema) ;

