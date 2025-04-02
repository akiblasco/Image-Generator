import Post from "../models/Posts.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all posts
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json({success: true, data: posts});
    } catch (error) {
        next(
            createError(
              error?.status || 500,
              error?.response?.data?.error?.message || error?.message || "Internal Server Error"
            )
        );
    }
}

// Create a post
export const createPost = async (req, res, next) => {
    try {
      console.log("Received post data:", req.body);
      
      // Check if post data exists
      if (!req.body.post) {
        return next(createError(400, "Post data is required"));
      }
      
      const { author, prompt, photo } = req.body.post;
      
      // Validate required fields
      if (!author || !prompt || !photo) {
        return next(createError(400, "Author, prompt, and photo are required"));
      }
      
      // Upload image to Cloudinary
      try {
        const photoUrl = await cloudinary.uploader.upload(photo);
        
        // Create a new post
        const newPost = new Post({
          name: author, // Adding name field to match schema
          author,
          prompt,
          photo: photoUrl.url,
        });
        
        // Save the post to the database
        const savedPost = await newPost.save();
        
        res.status(201).json({
          success: true,
          data: savedPost
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return next(createError(500, "Error uploading image to Cloudinary"));
      }
    } catch (error) {
      console.error("Error creating post:", error);
      next(createError(500, error.message || "Internal Server Error"));
    }
};