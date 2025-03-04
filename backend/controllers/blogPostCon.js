// controllers/blogController.js
import BlogPost from '../models/blogPost.js';
import asyncHandler from '../middleware/asyncHandler.js';


// Create a blog post
const createPost = asyncHandler (async (req, res) => {
    const newPost = new BlogPost({ 
        title : "Outfit of the Week",
        images:'images/sample.jpg' , 
        shortText:"olor sit amet consectetur adipisicing elit. Adipisci fugiat amet iusto fuga dolores, doloremque obcaecati, eligendi consequatur, " ,    
        content:" Lorem ipsum did cupiditate ea omnis neque distinctio mollitia. Quis, amet commodi distinctio esse exercitationem quam corporis, doloribus voluptas autem maiores similique porro animi aut, debitis illo! Eius libero, placeat nesciunt natus nostrum deserunt! Fugit rerum corrupti hic, sint beatae id! Recusandae ipsam atque numquam eos, aspernatur odit commodi aliquid laudantium tenetur veniam maiores, natus, officia facere expedita molestias accusantium sed vel! Perferendis, nesciunt! Veniam officia voluptate accusantium, impedit vitae provident voluptates soluta sapiente nostrum distinctio sequi rerum. Minima labore deserunt consectetur dolorem ullam perspiciatis exercitationem consequatur, neque mollitia facilis explicabo quae blanditiis nesciunt debitis ut nostrum quaerat praesentium quibusdam quidem repellendus sequi quis pariatur saepe. Beatae voluptatum laudantium quo assumenda id maiores? Iste iure dolor amet, eligendi obcaecati odio. Pariatur dolores odit natu "
    });
    await newPost.save();
    res.status(201).json(newPost);
});

// Read all blog posts
const getPosts = asyncHandler(async (req, res) => {
    const posts = await BlogPost.find().sort({createdAt : -1});
    res.status(200).json(posts);
});

// Read a single blog post
const getPost = asyncHandler(async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
});

// Update a blog post
const updatePost = asyncHandler(async (req, res) => {
    const { images, title, shortText, content } = req.body;
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, { images, title, shortText, content }, { new: true });
    if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(updatedPost);
});

// Delete a blog post
const deletePost = asyncHandler(async (req, res) => {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(204).send();

});

const getTopPosts = asyncHandler(async (req, res) => {
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }).limit(1)

    res.status(200).json(posts)
 })

export {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    getTopPosts
};