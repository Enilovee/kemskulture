// models/blogPost.js
import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    shortText: { type: String, required: true },
    images: [{type: String, required: true }],
    createdAt: { type: Date, default: Date.now },

}, {
    timestamps: true,
  }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;