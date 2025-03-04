import express from "express";
const router = express.Router();
import{ getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview,
    deleteProductReview,
    getTopProducts,
    getRandomProducts,
} from '../controllers/productCon.js'
import {protect, admin} from '../middleware/authMiddleware.js'



router.route('/').get(getProducts).post(protect, admin, createProduct );
router.get('/top', getTopProducts)
router.get('/random', getRandomProducts)
router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteProductReview)


export default router;