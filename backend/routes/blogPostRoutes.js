// routes/blogRoutes.js
import express from  'express';
const router = express.Router();
import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    getTopPosts
} from '../controllers/blogPostCon.js'
import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/') .post(protect, admin, createPost);
router.get('/', getPosts);
router.get('/top', getTopPosts);
router.get('/:id', getPost);
router.route('/:id') .put(protect, admin, updatePost);
router.route('/:id') .delete(protect, admin, deletePost);

export default router;