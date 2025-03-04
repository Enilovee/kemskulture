import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js'

// @descrp   Fectch all Prods
// @route    GET/api/products
// @access    Public 
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {name: { $regex: req.query.keyword, $options:'i'}} :{};
    const category = req.query.category ? { category: {$regex : req.query.category, $options:'i' }} : {};
    const brand = req.query.brand ? { brand:{$regex: req.query.brand, $options:'i'} } : {};
   

    // Count the total number of documents that match the filter
    const count = await Product.countDocuments({...keyword, ...category, ...brand, });

    // Fetch products with pagination
    const products = await Product.find({...keyword, ...category, ...brand, })
        .sort({createdAt : -1})
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});



 // @descrp   Fectch a Prod
// @route    GET/api/product/:id
// @access    Public 
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product){
        return res.json(product)
    }
    else{
        res.status(404);
        throw new Error('Resource not found')
    }    
 });

 // @descrp  create a Product
// @route    POST/api/products
// @access   Private Admin 
const createProduct  = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'sample name',
        price: 0,
        user: req.user._id,
        images: 'images/sample.jpg',
        productType:'clothes',
        brand :'sample brand',
        category : 'sample category',
        countInStock : 0,
        numReviews: 0,
        description: 'sample desc',
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
 });

 // @descrp  Update a product
// @route    PUT/api/products/:id
// @access    Private Admin 
const updateProduct  = asyncHandler(async (req, res) => {
    const { name, 
            price, 
            description,
            productType,
            images,
            brand,
            category,
            countInStock
    } = req.body

    const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name
            product.price = price
            product.description = description
            product.productType = productType
            product.images = images
            product.brand = brand
            product.category = category
            
            product.countInStock = countInStock

            const updateProduct = await product.save()
            res.json(updateProduct)
        } else {
           res.status(404) 
           throw new Error('Product not found')
        }
 });

 // @descrp  Delete a product
// @route    DELETE/api/products/:id
// @access    Private Admin 
const deleteProduct  = asyncHandler(async (req, res) => {
    

    const product = await Product.findById(req.params.id)

        if (product) {
            await Product.deleteOne({_id: product._id})
            res.status(200).json({message:"Product removed"})
        } else {
           res.status(404) 
           throw new Error('Product not found')
        }
 });

;


 // @descrp  Create a new review
// @route    POST/api/products/:id/review
// @access    Private 
const createProductReview  = asyncHandler(async (req, res) => {
  const { rating, comment }  = req.body
    const product = await Product.findById(req.params.id)

    if (product){
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        )
        if (alreadyReviewed){
            res.status(400)
            throw new Error('Product already reviwed')
        }

        const review = {
            name : req.user.name,
            rating : Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length

        product.rating = 
            product.reviews.reduce((acc, review) => acc+ review.rating, 0) / product.reviews.length 

            await product.save()
            res.status(200).json({message:"Review added"})
        
        } else {
            res.status(404) 
            throw new Error('Product not found')
     }
    });

       // @descrp  Delete a review
// @route    DELETE/api/products/:id/reviews/:reviewId
// @access    Private 
const deleteProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Find the review by its ID
        const review = product.reviews.find(review => review._id.toString() === req.params.reviewId);

        if (review) {
            // Remove the review from the product's reviews array
            product.reviews = product.reviews.filter(review => review._id.toString() !== req.params.reviewId);
            product.numReviews = product.reviews.length;

            // Recalculate the rating
            product.rating = product.reviews.length > 0 
                ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
                : 0;

            await product.save();
            res.status(200).json({ message: "Review removed" });
        } else {
            res.status(404);
            throw new Error('Review not found');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @descrp   Fectch a Prod
// @route    GET/api/product/:id
// @access    Public 
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(6)

    res.status(200).json(products)
 })
 // @descrp   Fectch a random Prod
// @route    GET/api/product/:id
// @access    Public 
const getRandomProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.aggregate([{ $sample: { size: 5 } }]); // Fetch 5 random products
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
 })
   


 export { 
    getProducts,
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview,
    deleteProductReview,
    getTopProducts,
    getRandomProducts,
};